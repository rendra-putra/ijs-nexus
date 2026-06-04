import {
  DownOutlined,
  EyeOutlined,
  MessageOutlined,
  UpOutlined,
  UserOutlined
} from "@ant-design/icons";

import {
  Badge,
  Card,
  Grid,
  Space,
  Tag,
  Tooltip,
  Typography
} from "antd";

import { Link } from "react-router-dom";
import { formatNumber } from "../../utils/formatNumberUtil";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function DiscussionItem({ item, isLast }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const getRibbonProps = () => {
    if (item.answered) return { text: "Answered", color: "green" };
    if (item.status === "closed") return { text: "Closed", color: "red" };
    if (item.status === "open") return { text: "Open", color: "default" };

    return {
      text: item.status ?? "Unknown",
      color: "default"
    };
  };

  const ribbon = getRibbonProps();

  return (
    <Badge.Ribbon text={ribbon.text} color={ribbon.color}>
      <Card
        style={{
          borderRadius: 10,
          marginBottom: isLast ? 0 : 16
        }}
        bodyStyle={{
          padding: isMobile ? "20px 12px 12px" : "20px"
          // 👆 top padding lebih besar di mobile
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
            marginTop: isMobile ? 8 : 0 // 👈 ini kuncinya
          }}
          size={12}
        >

          {/* TITLE */}
          <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
            <Link
              to={`/discussions/read/${item.slug}`}
              style={{ color: "#1677ff" }}
            >
              {item.question}
            </Link>
          </Title>

          {/* TAGS */}
          {item.tags?.length > 0 && (
            <Space wrap size={[6, 6]}>
              {item.tags.map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    background: "#e1ecf4",
                    color: "#39739d",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 12,
                    padding: "2px 8px"
                  }}
                >
                  {tag}
                </Tag>
              ))}
            </Space>
          )}

          {/* FOOTER */}
          {isMobile ? (
            // ✅ MOBILE (STACK)
            <Space direction="vertical" size={8} style={{ width: "100%" }}>

              {/* Author */}
              <Space wrap size={6}>
                <UserOutlined />
                <Text>{item.questioner}</Text>
                <Text type="secondary">
                  • {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </Space>

              {/* Stats */}
              <Space wrap size={[12, 6]}>
                <Stat icon={<UpOutlined />} value={item.upvoteCount} />
                <Stat icon={<DownOutlined />} value={item.downvoteCount} />
                <Stat icon={<MessageOutlined />} value={item.answerCount} />
                <Stat icon={<EyeOutlined />} value={item.viewCount} />
              </Space>

            </Space>
          ) : (
            // ✅ DESKTOP (INLINE)
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 8
              }}
            >
              {/* LEFT: Author */}
              <Space size={6}>
                <UserOutlined />
                <Text>{item.questioner}</Text>
                <Text type="secondary">
                  asked on {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </Space>

              {/* RIGHT: Stats */}
              <div style={{ marginLeft: "auto" }}>
                <Space size={16}>
                  <Stat icon={<UpOutlined />} value={item.upvoteCount} />
                  <Stat icon={<DownOutlined />} value={item.downvoteCount} />
                  <Stat icon={<MessageOutlined />} value={item.answerCount} />
                  <Stat icon={<EyeOutlined />} value={item.viewCount} />
                </Space>
              </div>
            </div>
          )}

        </Space>
      </Card>
    </Badge.Ribbon>
  );
}

/* ================= SMALL COMPONENT ================= */
function Stat({ icon, value, highlight }) {
  return (
    <Tooltip title="">
      <Space
        size={4}
        style={{
          fontWeight: highlight ? 600 : undefined
        }}
      >
        {icon}
        <Text>{formatNumber(value ?? 0)}</Text>
      </Space>
    </Tooltip>
  );
}