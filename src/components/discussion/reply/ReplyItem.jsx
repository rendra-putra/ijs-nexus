import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FlagOutlined,
  MessageOutlined,
  MoreOutlined,
  StopOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Dropdown,
  Space,
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
import ReplyForm from "./ReplyForm";

const { Text } = Typography;

export default function ReplyItem({
  reply,
  onReply,
  onEdit,
  onDelete,
  onVote
}) {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const [isEditing, setIsEditing] = useState(false);
  const isDeleted =
    reply.deletedAt || reply.status === "DELETED";
  const isEdited =
    reply.status?.toUpperCase() === "EDITED";
  const isBanned =
    reply.status?.toUpperCase() === "BANNED";
  const isLocked = isDeleted || isBanned;
  const isOwner = user?.id === reply.userId;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const menuItems = () => {
    const items = [];

    // =========================
    // OWNER
    // =========================
    if (isOwner) {
      items.push(
        {
          key: "edit",
          label: "Edit",
          icon: <EditOutlined />,
          disabled: isLocked,
          onClick: () => setIsEditing(true),
        },
        {
          key: "delete",
          label: "Delete",
          icon: <DeleteOutlined />,
          danger: true,
          disabled: isLocked,
          onClick: () => onDelete(reply.id),
        }
      );
    }

    // =========================
    // OTHER USERS
    // =========================
    if (!isOwner) {
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

  const handleUpdate = async (content) => {
    const success = await onEdit(reply.id, content);

    if (success) setIsEditing(false);
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          padding: "24px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {isEditing ? (
          <ReplyForm
            initialValue={reply.answer}
            onSend={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            {isDeleted ? (
              <Space style={{ color: "#999", fontStyle: "italic" }}>
                <StopOutlined />
                <span>This reply was deleted</span>
              </Space>
            ) : isBanned ? (
              <Space style={{ color: token.colorError, fontStyle: "italic" }}>
                <StopOutlined />
                <span>This reply was banned by moderator</span>
              </Space>
            ) : (
              <div
                style={{ whiteSpace: "pre-wrap" }} // 🔥 INI JUGA
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    marked.parse(reply.answer || "")
                  )
                }}
              />
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 10
              }}
            >
              {/* LEFT */}
              <Space wrap size={8}>
                <Avatar icon={<UserOutlined />} size="small" />
                <Text strong>{reply.fullname}</Text>

                <Text type="secondary" style={{ fontSize: 12 }}>
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleDateString()
                    : ""}
                </Text>

                {isEdited && reply.updatedAt && !isDeleted && (
                  <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                    • Edited {dayjs(reply.updatedAt).fromNow()}
                  </Text>
                )}

                {isDeleted && reply.deletedAt && (
                  <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
                    • Deleted {dayjs(reply.deletedAt).fromNow()}
                  </Text>
                )}
              </Space>

              {/* RIGHT */}
              <Space wrap size={4}>
                <Button
                  type={reply.upvoted ? "primary" : "text"}
                  size="small"
                  icon={<UpOutlined />}
                  disabled={isLocked}
                  onClick={() => onVote?.(reply.id, "up")}
                >
                  {formatNumber(reply.upvoteCount ?? 0)}
                </Button>

                <Button
                  type={reply.downvoted ? "primary" : "text"}
                  danger={reply.downvoted}
                  size="small"
                  icon={<DownOutlined />}
                  disabled={isLocked}
                  onClick={() => onVote?.(reply.id, "down")}
                >
                  {formatNumber(reply.downvoteCount ?? 0)}
                </Button>

                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  disabled={isLocked}
                  onClick={onReply}
                >
                  {formatNumber(reply.replyCount)}
                </Button>

                <Dropdown menu={{ items: menuItems() }} trigger={["click"]}>
                  <Button type="text" size="small" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            </div>
          </>
        )}
      </div>
      <ReportModal
        open={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        reportedUser={{
          id: reply.userId,
          fullname: reply.fullname
        }}
        reference={{
          kind: "Reply",
          id: reply.id,
          snippet: reply.answer
        }}
      />
    </>
  );
}