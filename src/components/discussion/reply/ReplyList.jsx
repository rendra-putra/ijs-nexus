import { useMutation, useQuery } from "@apollo/client/react";
import { App, Grid } from "antd";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  CREATE_REPLY,
  DELETE_REPLY,
  GET_REPLIES,
  UPDATE_REPLY
} from "../../../services/replyService";

import { VOTE_REPLY } from "../../../services/replyVoteService";

import ReplyForm from "./ReplyForm";
import ReplyItem from "./ReplyItem";

const MAX_DEPTH = 5;

export default function ReplyList({
  parentId,
  depth = 0,
  onReplyAdded
}) {
  const { user } = useAuth();
  const { message } = App.useApp();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [expandedReplies, setExpandedReplies] = useState({});

  // ✅ SINGLE SOURCE OF TRUTH
  const { data, loading, refetch } = useQuery(GET_REPLIES, {
    variables: {
      parentId,
      userId: user?.id || ""
    },
    skip: !parentId,
    fetchPolicy: "network-only" // 🔥 penting
  });

  const replies = data?.replies || [];

  const [createReply, { loading: creating }] = useMutation(CREATE_REPLY);
  const [updateReply] = useMutation(UPDATE_REPLY);
  const [deleteReply] = useMutation(DELETE_REPLY);
  const [voteReply] = useMutation(VOTE_REPLY);

  if (depth > MAX_DEPTH) return null;

  // =========================
  // CREATE
  // =========================
  const handleSend = async (content) => {
    if (!user) {
      message.error("Harus login dulu ❌");
      return;
    }

    try {
      await createReply({
        variables: {
          parentId,
          userId: user.id,
          fullname: user.fullname,
          answer: content
        }
      });

      // 🔥 UPDATE COUNT LANGSUNG
      onReplyAdded?.(parentId);

      // 🔥 FORCE REFRESH
      await refetch();

      message.success("Reply berhasil dikirim ✅");
    } catch (err) {
      message.error("Gagal mengirim reply ❌");
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleEdit = async (id, content) => {
    const target = replies.find((r) => r.id === id);

    if (!target || target.userId !== user?.id) {
      message.error("Tidak bisa edit reply orang lain ❌");
      return false;
    }

    try {
      await updateReply({
        variables: {
          id,
          userId: user.id,
          input: { answer: content }
        }
      });

      await refetch();

      message.success("Reply berhasil diupdate ✏️");
      return true;
    } catch (err) {
      message.error("Gagal update reply ❌");
      return false;
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const target = replies.find((r) => r.id === id);

    if (!target || target.userId !== user?.id) {
      message.error("Tidak bisa hapus reply orang lain ❌");
      return;
    }

    try {
      await deleteReply({
        variables: {
          id,
          userId: user.id
        }
      });

      await refetch();

      message.success("Reply berhasil dihapus 🗑️");
    } catch (err) {
      message.error("Gagal hapus reply ❌");
    }
  };

  // =========================
  // VOTE REPLY
  // =========================
  const handleVote = async (id, type) => {
    if (!user) return;

    try {
      await voteReply({
        variables: {
          replyId: id,
          userId: user.id,
          type
        }
      });

      await refetch();
    } catch (err) {
      message.error("Gagal vote reply ❌");
    }
  };

  // =========================
  // TOGGLE
  // =========================
  const handleToggleReply = (replyId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  if (loading) {
    return <div style={{ padding: 12 }}>Loading replies...</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <ReplyForm onSend={handleSend} loading={creating} />
      </div>

      <div
        style={{
          borderLeft: "2px solid #e5e7eb",
          paddingLeft: screens.xs ? 10 : 16,
          marginTop: 10,
          marginLeft: screens.xs ? 4 : 8,

          // 🔥 TAMBAHAN DI SINI
          background: depth > 0 ? "rgba(0,0,0,0.02)" : "transparent",
          borderRadius: 6,
          paddingTop: depth > 0 ? 8 : 0,
          paddingBottom: depth > 0 ? 8 : 0
        }}
      >
        {replies.map((reply) => (
          <div key={reply.id} style={{ marginTop: 14 }}>
            <ReplyItem
              reply={reply}
              onReply={() => handleToggleReply(reply.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onVote={handleVote}
            />

            {expandedReplies[reply.id] && (
              <ReplyList
                parentId={reply.id}
                depth={depth + 1}
                onReplyAdded={(id) => {
                  onReplyAdded?.(reply.id);
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}