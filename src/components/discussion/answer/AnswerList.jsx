import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { App, Button, Card, Grid, Space, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { formatNumber } from "../../../utils/formatNumberUtil";

import AnswerForm from "./AnswerForm";
import AnswerItem from "./AnswerItem";

import { GET_DISCUSSION_BY_SLUG } from "../../../services/discussionService";
import {
  CREATE_REPLY,
  DELETE_REPLY,
  GET_REPLIES,
  MARK_ACCEPTED_REPLY,
  UPDATE_REPLY,
  VOTE_REPLY,
} from "../../../services/replyService";

const { Text } = Typography;

export default function AnswerList({
  discussionId,
  slug,
  status,
  onAcceptedAnswer
}) {
  const { user } = useAuth();
  const { message } = App.useApp();
  const [answerSort, setAnswerSort] = useState("highest");
  const [fetchReplies] = useLazyQuery(GET_REPLIES, {
    fetchPolicy: "network-only"
  });

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const { data, loading, refetch } = useQuery(GET_REPLIES, {
    variables: {
      parentId: discussionId,
      userId: user?.id || ""
    },
    skip: !discussionId,
    fetchPolicy: "network-only" // 🔥 WAJIB
  });

  const { data: discussionData } = useQuery(GET_DISCUSSION_BY_SLUG, {
    variables: { slug },
    skip: !slug
  });

  // ✅ LOCAL STATE (SOURCE OF TRUTH UI)
  const [answers, setAnswers] = useState([]);

  // 🔥 sync dari server → local
  useEffect(() => {
    if (data?.replies) {
      setAnswers(data.replies);
    }
  }, [data]);

  const [createReply, { loading: creating }] = useMutation(CREATE_REPLY);
  const [updateReply] = useMutation(UPDATE_REPLY);
  const [deleteReply] = useMutation(DELETE_REPLY);
  const [voteReply] = useMutation(VOTE_REPLY);
  const [markAccepted] = useMutation(MARK_ACCEPTED_REPLY);

  // =========================
  // CREATE
  // =========================
  const handleSend = async (content) => {
    if (!user) return;

    try {
      const { data } = await createReply({
        variables: {
          parentId: discussionId,
          userId: user.id,
          fullname: user.fullname,
          answer: content
        },
        refetchQueries: [
          {
            query: GET_DISCUSSION_BY_SLUG,
            variables: { slug }
          }
        ]
      });

      // ✅ instant UI
      if (data?.createReply) {
        setAnswers((prev) => [
          ...prev,
          data.createReply
        ]);
      }

      // 🔥 sync server (tanpa ganggu UI)
      refetch();
      message.success("Answer berhasil dikirim ✅");
    } catch (err) {
      message.error("Gagal mengirim answer ❌");
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = async (id, content) => {
    const target = answers.find((a) => a.id === id);

    if (!target || target.userId !== user?.id) return false;

    try {
      await updateReply({
        variables: {
          id,
          userId: user.id,
          input: { answer: content }
        }
      });

      // ✅ instant UI
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
              ...a,
              answer: content,
              status: "EDITED", // 🔥 penting
              updatedAt: new Date().toISOString() // 🔥 penting
            }
            : a
        )
      );

      refetch();
      message.success("Answer berhasil diupdate ✏️");
      return true;
    } catch (err) {
      message.error("Gagal mengupdate answer ❌");
      return false;
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const target = answers.find((a) => a.id === id);

    if (!target || target.userId !== user?.id) return;

    try {
      await deleteReply({
        variables: {
          id,
          userId: user.id
        }
      });

      // ✅ instant UI
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "DELETED",
                answer: "",
                deletedAt: new Date().toISOString(),
              }
            : a
        )
      );

      refetch();
      message.success("Answer berhasil dihapus 🗑️");
    } catch (err) {
      message.error("Gagal menghapus answer ❌");
    }
  };

  const handleVote = async (id, type) => {
    if (!user) return;

    const target = answers.find((a) => a.id === id);
    if (!target) return;

    const prev = { ...target };

    // =========================
    // OPTIMISTIC UI 🔥
    // =========================
    let newUp = target.upvoteCount || 0;
    let newDown = target.downvoteCount || 0;
    let upvoted = target.upvoted;
    let downvoted = target.downvoted;

    if (type === "up") {
      if (upvoted) {
        newUp -= 1;
        upvoted = false;
      } else if (downvoted) {
        newUp += 1;
        newDown -= 1;
        upvoted = true;
        downvoted = false;
      } else {
        newUp += 1;
        upvoted = true;
      }
    }

    if (type === "down") {
      if (downvoted) {
        newDown -= 1;
        downvoted = false;
      } else if (upvoted) {
        newDown += 1;
        newUp -= 1;
        downvoted = true;
        upvoted = false;
      } else {
        newDown += 1;
        downvoted = true;
      }
    }

    // ✅ APPLY KE UI (instant)
    setAnswers((prevState) =>
      prevState.map((a) =>
        a.id === id
          ? {
            ...a,
            upvoteCount: newUp,
            downvoteCount: newDown,
            upvoted,
            downvoted
          }
          : a
      )
    );

    try {
      await voteReply({
        variables: {
          replyId: id,
          userId: user.id,
          type
        }
      });

      // 🔥 silent sync (tanpa flicker)
      fetchReplies({
        variables: {
          parentId: discussionId,
          userId: user?.id || ""
        }
      });
    } catch (err) {
      // ❗ rollback kalau gagal
      setAnswers((prevState) =>
        prevState.map((a) =>
          a.id === id ? prev : a
        )
      );

      message.error("Gagal vote ❌");
    }
  };

  const handleAccept = async (id) => {
    if (!user) return;

    const target = answers.find((a) => a.id === id);
    if (!target) return;

    const prev = [...answers];

    // =========================
    // 🔥 OPTIMISTIC UI
    // =========================
    setAnswers((prevState) =>
      prevState.map((a) =>
        a.id === id
          ? { ...a, verified: true }
          : a
      )
    );

    try {
      await markAccepted({
        variables: {
          replyId: id,
          userId: user.id
        },
        refetchQueries: [
          {
            query: GET_DISCUSSION_BY_SLUG,
            variables: { slug }
          }
        ]
      });

      // 🔥 trigger parent update
      onAcceptedAnswer?.();

      // ✅ ANGGAP SUCCESS kalau tidak throw network error
      message.success("Marked as accepted ✅");

      // 🔥 optional silent sync
      fetchReplies({
        variables: {
          parentId: discussionId,
          userId: user?.id || ""
        }
      });

    } catch (err) {
      // ❗ rollback hanya kalau benar-benar network error
      setAnswers(prev);

      message.error("Gagal mark as accepted ❌");
    }
  };

  // =========================
  // REPLY COUNT UPDATE (🔥 FIX UTAMA)
  // =========================
  const handleReplyAdded = (id) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
            ...a,
            replyCount: (a.replyCount || 0) + 1
          }
          : a
      )
    );
  };

  // =========================
  // SORT
  // =========================
  const sortedAnswers = useMemo(() => {
    const arr = [...answers];

    // =========================
    // HIGHEST
    // =========================
    if (answerSort === "highest") {
      return arr.sort((a, b) => {
        // accepted tetap atas
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;

        // deleted/banned tetap bawah
        const isDeletedA =
          a.status === "DELETED" ||
          a.status === "BANNED";

        const isDeletedB =
          b.status === "DELETED" ||
          b.status === "BANNED";

        if (isDeletedA && !isDeletedB) return 1;
        if (!isDeletedA && isDeletedB) return -1;

        const scoreA =
          (a.upvoteCount || 0) - (a.downvoteCount || 0);

        const scoreB =
          (b.upvoteCount || 0) - (b.downvoteCount || 0);

        return scoreB - scoreA;
      });
    }

    // =========================
    // NEWEST
    // =========================
    if (answerSort === "newest") {
      return arr.sort((a, b) => {
        // accepted tetap atas
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;

        // deleted/banned tetap bawah
        const isDeletedA =
          a.status === "DELETED" ||
          a.status === "BANNED";

        const isDeletedB =
          b.status === "DELETED" ||
          b.status === "BANNED";

        if (isDeletedA && !isDeletedB) return 1;
        if (!isDeletedA && isDeletedB) return -1;

        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );
      });
    }

    return arr;
  }, [answers, answerSort]);

  if (loading) {
    return <div style={{ padding: 12 }}>Loading answers...</div>;
  }

  return (
    <Card
      style={{ marginTop: 24, borderRadius: 12 }}
      title={
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: screens.xs ? "center" : "space-between",
            rowGap: 10,
            columnGap: 8,
            paddingTop: 6,     // 🔥 sedikit naik
            paddingBottom: 10  // 🔥 INI YANG UTAMA (lebih lega ke bawah)
          }}
        >
          {/* COUNT */}
          <Text
            strong
            style={{
              flexShrink: 0,
              textAlign: screens.xs ? "center" : "left",
              width: screens.xs ? "100%" : "auto"
            }}
          >
            {formatNumber(answers.length)} Answers
          </Text>

          {/* SORT */}
          <div
            style={{
              marginLeft: screens.xs ? 0 : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: screens.xs ? "center" : "flex-end",
              gap: 8,
              flexWrap: "wrap",
              minWidth: screens.xs ? "auto" : 260,
              width: screens.xs ? "100%" : "auto"
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: 500 }}>
              Sorted by:
            </Text>

            <Space.Compact size="small">
              <Button
                type={answerSort === "highest" ? "primary" : "default"}
                size="small"
                onClick={() => setAnswerSort("highest")}
              >
                Highest
              </Button>

              <Button
                type={answerSort === "newest" ? "primary" : "default"}
                size="small"
                onClick={() => setAnswerSort("newest")}
              >
                Newest
              </Button>
            </Space.Compact>
          </div>
        </div>
      }
    >
      <AnswerForm onSend={handleSend} loading={creating} />

      <div style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {sortedAnswers.map((answer) => (
            <AnswerItem
              key={answer.id}
              answer={answer}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onReplyAdded={handleReplyAdded}
              onVote={handleVote}
              onAccept={handleAccept}
              isDiscussionOwner={user?.id === discussionData?.discussion?.userId}
            />
          ))}
        </Space>
      </div>
    </Card>
  );
}