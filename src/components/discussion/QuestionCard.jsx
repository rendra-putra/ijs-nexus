import {
  Button,
  Card,
  Divider,
  Popconfirm,
  Space,
  Tag,
  Typography,
  theme
} from "antd";

import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";

import DOMPurify from "dompurify";
import { marked } from "marked";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DiscussionActions from "./DiscussionActions";

const { Title, Text, Paragraph } = Typography;

export default function QuestionCard({
  discussion,
  onToggleStatus,
  onDelete
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const isOwner = user?.id === discussion?.userId;

  return (
    <Card
      style={{ borderRadius: 12 }}
      title={
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // 🔥 kunci utama
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* STATUS */}
          <Button
            size="small"
            type={discussion.status === "open" ? "primary" : "default"}
            danger={discussion.status === "closed"}
            style={{
              borderRadius: 999,
              pointerEvents: "none",
              flexShrink: 0
            }}
          >
            {discussion.status?.toUpperCase()}
          </Button>

          {/* OWNER ACTIONS */}
          {isOwner && (
            <div
              style={{
                marginLeft: "auto", // 🔥 dorong ke kanan
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "flex-end"
              }}
            >
              <Button
                danger={discussion.status === "open"}
                onClick={onToggleStatus}
              >
                {discussion.status === "open" ? "Close" : "Reopen"}
              </Button>

              <Button
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(`/discussions/update/${discussion.id}`)
                }
              />

              <Popconfirm
                title="Delete this discussion?"
                onConfirm={onDelete}
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </div>
          )}
        </div>
      }
    >
      {/* TITLE */}
      <Title level={2}>{discussion?.question}</Title>

      {/* TAG + META */}
      <div style={{ marginBottom: 12 }}>
        {discussion?.tags?.length > 0 && (
          <Space wrap style={{ marginBottom: 8 }}>
            {discussion.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </Space>
        )}

        <div>
          <Text>
            Asked by <Text strong>{discussion?.questioner}</Text>
          </Text>

          {discussion?.createdAt && (
            <Text type="secondary">
              {" "}
              • {new Date(discussion.createdAt).toLocaleDateString()}
            </Text>
          )}
        </div>
      </div>

      <Divider />

      {/* DETAIL */}
      <Paragraph>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(discussion?.detail || "")
            )
          }}
        />
      </Paragraph>

      <DiscussionActions discussion={discussion} />
    </Card>
  );
}