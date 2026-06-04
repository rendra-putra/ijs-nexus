import {
  CheckCircleOutlined, DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FlagOutlined,
  MessageOutlined,
  MoreOutlined,
  StopOutlined,
  UpOutlined,
  UserOutlined
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Dropdown,
  Space,
  Tooltip,
  Typography,
  theme
} from "antd";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useState } from "react";

import dayjs from "dayjs";
import { useAuth } from "../../../contexts/AuthContext";
import { formatNumber } from "../../../utils/formatNumberUtil";
import ReportModal from "../../report/ReportModal";
import ReplyList from "../reply/ReplyList";
import AnswerForm from "./AnswerForm";

const { Text } = Typography;

export default function AnswerItem({
  answer,
  onEdit,
  onDelete,
  onReplyAdded,
  onAccept,
  onVote,
  isDiscussionOwner
}) {
  const { user } = useAuth();
  const { token } = theme.useToken();

  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isDeleted =
    answer.deletedAt || answer.status === "DELETED";
  const isEdited =
    answer.status?.toUpperCase() === "EDITED";
  const isBanned =
    answer.status?.toUpperCase() === "BANNED";
  const isLocked = isDeleted || isBanned;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // ✅ UPDATE
  const handleUpdate = async (content) => {
    const success = await onEdit(answer.id, content);
    if (success) setIsEditing(false);
  };

  // ✅ ACCEPT
  const handleAccept = () => {
    onAccept?.(answer.id);
  };

  // ✅ MENU
  const menuItems = () => {
    const items = [];

    // =========================
    // ✅ ACCEPT (discussion owner)
    // =========================
    if (isDiscussionOwner) {
      items.push({
        key: "accept",
        label: answer.verified
          ? "Accepted"
          : "Mark as Accepted Answer",
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
        disabled: answer.verified || isLocked,
        onClick: handleAccept
      });
    }

    // =========================
    // ✅ EDIT & DELETE (answer owner)
    // =========================
    if (user?.id === answer.userId) {
      items.push(
        {
          key: "edit",
          label: "Edit",
          icon: <EditOutlined />,
          disabled: isLocked,
          onClick: () => setIsEditing(true)
        },
        {
          key: "delete",
          label: "Delete",
          icon: <DeleteOutlined />,
          danger: true,
          disabled: isLocked || answer.verified,
          onClick: () => onDelete(answer.id)
        }
      );
    }

    // =========================
    // ✅ REPORT (other users)
    // =========================
    if (user?.id !== answer.userId) {
      items.push({
        key: "report",
        label: "Report",
        icon: <FlagOutlined />,
        disabled: isLocked,
        onClick: () => setIsReportModalOpen(true)
      });
    }

    return items;
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          padding: "24px 0",
          borderBottom: "1px solid #f0f0f0"
        }}
      >
        {/* ===== CONTENT ===== */}
        {isEditing ? (
          <AnswerForm
            initialValue={answer.answer}
            onSend={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                padding: answer.verified ? "12px 16px" : 0,
                borderRadius: 8,
                border: answer.verified ? `1px solid ${token.colorSuccessBorder}` : "none",
                background: answer.verified ? token.colorSuccessBg : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              {/* ICON */}
              {answer.verified && (
                <Tooltip title="Accepted Answer">
                  <div
                    style={{
                      color: token.colorSuccess,
                      fontSize: 20,
                      marginTop: 4
                    }}
                  >
                    <CheckCircleOutlined />
                  </div>
                </Tooltip>
              )}

              <div style={{ flex: 1 }}>
                {/* CONTENT */}
                {isDeleted ? (
                  <Space style={{ color: token.colorTextSecondary, fontStyle: "italic" }}>
                    <StopOutlined />
                    <span>This answer was deleted</span>
                  </Space>
                ) : isBanned ? (
                  <Space style={{ color: token.colorError, fontStyle: "italic" }}>
                    <StopOutlined />
                    <span>This answer was banned by moderator</span>
                  </Space>
                ) : (
                  <div
                    style={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        marked.parse(answer.answer || "")
                      )
                    }}
                  />
                )}
              </div>
            </div>

            {/* ===== META ===== */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 12
              }}
            >
              {/* LEFT */}
              <Space wrap size={8}>
                <Avatar icon={<UserOutlined />} size="small" />
                <Text strong>{answer.fullname}</Text>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {answer.createdAt
                    ? new Date(answer.createdAt).toLocaleDateString()
                    : ""}
                </Text>

                {isEdited && answer.updatedAt && !isDeleted && (
                  <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                    • Edited {dayjs(answer.updatedAt).fromNow()}
                  </Text>
                )}

                {isDeleted && answer.deletedAt && (
                  <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                    • Deleted {dayjs(answer.deletedAt).fromNow()}
                  </Text>
                )}
              </Space>

              {/* RIGHT ACTIONS */}
              <Space wrap size={4}>
                <Button
                  type={answer.upvoted ? "primary" : "text"}
                  size="small"
                  icon={<UpOutlined />}
                  disabled={isLocked}
                  onClick={() => onVote?.(answer.id, "up")}
                >
                  {formatNumber(answer.upvoteCount ?? 0)}
                </Button>

                <Button
                  type={answer.downvoted ? "primary" : "text"}
                  danger={answer.downvoted}
                  size="small"
                  icon={<DownOutlined />}
                  disabled={isLocked}
                  onClick={() => onVote?.(answer.id, "down")}
                >
                  {formatNumber(answer.downvoteCount ?? 0)}
                </Button>

                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  disabled={isLocked}
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {formatNumber(answer.replyCount)}
                </Button>

                <Dropdown menu={{ items: menuItems() }} trigger={["click"]}>
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            </div>
          </>
        )}
      </div>

      {/* ===== REPLIES ===== */}
      {showReplies && (
        <ReplyList
          parentId={answer.id}
          onReplyAdded={(id) => {
            onReplyAdded?.(id);
          }}
        />
      )}
      <ReportModal
        open={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        reportedUser={{
          id: answer.userId,
          fullname: answer.fullname
        }}
        reference={{
          kind: "Reply",
          id: answer.id,
          snippet: answer.answer
        }}
      />
    </div>
  );
}