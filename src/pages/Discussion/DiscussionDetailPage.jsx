import {
  useMutation,
  useQuery
} from "@apollo/client/react";

import { Alert, App, Grid, Spin } from "antd";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import AnswerList from "../../components/discussion/answer/AnswerList";
import QuestionCard from "../../components/discussion/QuestionCard";

import {
  DELETE_DISCUSSION,
  GET_DISCUSSION_BY_SLUG,
  TOGGLE_DISCUSSION_STATUS
} from "../../services/discussionService";

import { VIEW_DISCUSSION } from "../../services/discussionViewVoteService";

export default function DiscussionDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { message } = App.useApp();
  const navigate = useNavigate();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const { data, loading, error } = useQuery(GET_DISCUSSION_BY_SLUG, {
    variables: { slug },
    fetchPolicy: "network-only"
  });

  const discussion = data?.discussion;

  // 🔥 SINGLE SOURCE OF TRUTH
  const [localDiscussion, setLocalDiscussion] = useState(null);

  useEffect(() => {
    if (discussion) {
      setLocalDiscussion(discussion);
    }
  }, [discussion]);

  const [viewDiscussion] = useMutation(VIEW_DISCUSSION);
  const [toggleDiscussion] = useMutation(TOGGLE_DISCUSSION_STATUS);
  const [deleteDiscussion] = useMutation(DELETE_DISCUSSION);

  useEffect(() => {
    if (!discussion?.id || !user?.id) return;

    viewDiscussion({
      variables: {
        discussionId: discussion.id,
        userId: user.id
      }
    });
  }, [discussion?.id, user?.id]);

  // =========================
  // 🔥 DELETE DISCUSSION
  // =========================
  const handleDeleteDiscussion = async () => {
    if (!user || !localDiscussion) return;

    if (user.id !== localDiscussion.userId) {
      message.error("Not allowed ❌");
      return;
    }

    try {
      await deleteDiscussion({
        variables: {
          id: localDiscussion.id,
          fullname: user.fullname || user.fullName // 🔥 FIX
        }
      });

      message.success("Deleted 🗑️");
      navigate("/discussions");
    } catch (err) {
      console.error(err);
      message.error("Failed ❌");
    }
  };

  // =========================
  // 🔥 TOGGLE STATUS
  // =========================
  const handleToggleStatus = async () => {
    if (!user || !localDiscussion) return;

    const nextStatus =
      localDiscussion.status === "open" ? "closed" : "open";

    const prev = { ...localDiscussion };

    // ✅ optimistic UI
    setLocalDiscussion((prevState) => ({
      ...prevState,
      status: nextStatus
    }));

    try {
      await toggleDiscussion({
        variables: {
          discussionId: localDiscussion.id,
          userId: user.id,
          status: nextStatus
        }
      });

      message.success(
        nextStatus === "closed"
          ? "Discussion closed 🔒"
          : "Discussion reopened 🔓"
      );
    } catch (err) {
      console.error(err);

      // rollback
      setLocalDiscussion(prev);

      message.error("Failed to update discussion ❌");
    }
  };

  // =========================
  // ACCEPTED ANSWER
  // =========================
  const handleAcceptedAnswer = () => {
    // 🔥 langsung update UI tanpa tunggu refetch
    setLocalDiscussion((prev) => ({
      ...prev,
      status: "closed"
    }));
  };

  if (loading) return <Spin fullscreen />;
  if (error) return <Alert type="error" description={error.message} />;
  if (!localDiscussion) {
    return (
      <Alert
        type="warning"
        message="Discussion not found"
        description="The discussion you are looking for does not exist or has been removed."
        showIcon
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: screens.xs ? 12 : 16
      }}
    >
      <QuestionCard
        discussion={localDiscussion}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteDiscussion}
      />

      <AnswerList
        discussionId={localDiscussion.id}
        slug={localDiscussion.slug}
        status={localDiscussion.status}
        onAcceptedAnswer={handleAcceptedAnswer}
      />
    </div>
  );
}