import { IssuesCloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Space,
  Tag,
  Typography,
  Grid,
} from "antd";
import { Link } from "react-router-dom";
import { formatNumber } from "../../utils/formatNumberUtil";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function MyDiscussionItem({ item, onToggleStatus }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const renderStatusTag = (status) => (
    <Tag
      color={status === "open" ? "green" : "red"}
      style={{
        fontWeight: 600,
        borderRadius: 6,
        width: "fit-content",
      }}
    >
      {status.toUpperCase()}
    </Tag>
  );

  // =========================
  // 📱 MOBILE
  // =========================
  if (isMobile) {
    return (
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        
        {/* STATUS */}
        {renderStatusTag(item.status)}

        {/* TITLE */}
        <Title level={5} style={{ margin: 0, wordBreak: "break-word" }}>
          <Link to={`/discussions/read/${item.slug}`}>
            {item.question}
          </Link>
        </Title>

        {/* TAGS */}
        <div style={{ overflowX: "auto" }}>
          <Space wrap>
            {item.tags?.map((tag) => (
              <Tag
                key={tag}
                style={{
                  background: "#e1ecf4",
                  color: "#39739d",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        </div>

        {/* STATS */}
        <Space wrap size="small">
          <Text strong>{formatNumber(item.upvoteCount)} upvotes</Text>
          <Text strong>{formatNumber(item.downvoteCount)} downvotes</Text>
          <Text strong>{formatNumber(item.answerCount)} answers</Text>
          <Text strong>{formatNumber(item.viewCount)} views</Text>
        </Space>

        {/* FOOTER */}
        <Row justify="space-between" align="middle">
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>

          <Button
            size="small"
            type={item.status === "open" ? "primary" : "default"}
            danger={item.status === "open"}
            icon={<IssuesCloseOutlined />}
            onClick={() => onToggleStatus(item)}
          >
            {item.status === "open" ? "Close" : "Reopen"}
          </Button>
        </Row>
      </Space>
    );
  }

  // =========================
  // 💻 DESKTOP / TABLET
  // =========================
  return (
    <Row gutter={16} align="top" style={{ width: "100%" }}>
      
      {/* STATS */}
      <Col xs={0} md={6} lg={4}>
        <Space direction="vertical" size={4}>
          <Text strong>{formatNumber(item.upvoteCount)} upvotes</Text>
          <Text strong>{formatNumber(item.downvoteCount)} downvotes</Text>
          <Text strong>{formatNumber(item.answerCount)} answers</Text>
          <Text strong>{formatNumber(item.viewCount)} views</Text>
        </Space>
      </Col>

      {/* CONTENT */}
      <Col xs={24} md={14} lg={16}>
        <Space direction="vertical" size={6} style={{ width: "100%" }}>
          
          {/* STATUS (FIX: di atas title) */}
          {renderStatusTag(item.status)}

          {/* TITLE */}
          <Title level={5} style={{ margin: 0, wordBreak: "break-word" }}>
            <Link to={`/discussions/read/${item.slug}`}>
              {item.question}
            </Link>
          </Title>

          {/* TAGS (FIX: selalu kelihatan) */}
          <div>
            <Space wrap>
              {item.tags?.map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    background: "#e1ecf4",
                    color: "#39739d",
                    border: "none",
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          </div>

          <Text type="secondary">
            asked on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Space>
      </Col>

      {/* ACTION (FIX: bener2 nempel kanan) */}
      <Col
        xs={24}
        md={4}
        lg={4}
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          size="small"
          type={item.status === "open" ? "primary" : "default"}
          danger={item.status === "open"}
          icon={<IssuesCloseOutlined />}
          onClick={() => onToggleStatus(item)}
        >
          {item.status === "open" ? "Close" : "Reopen"}
        </Button>
      </Col>
    </Row>
  );
}