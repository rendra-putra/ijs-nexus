import {
  EyeOutlined,
  LikeOutlined, MessageOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Card, Space, Tag, Tooltip, Typography } from "antd";
import { formatNumber } from "../../utils/formatNumberUtil";

const { Title, Text } = Typography;

export default function ArticleItem({ item, onClick }) {
  return (
    <Card
      hoverable
      style={{ borderRadius: 10, width: "100%" }}
      onClick={onClick}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={4} style={{ margin: 0 }}>
          {item.title}
        </Title>

        <Space wrap>
          {item.tags.map((tag) => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </Space>

        {/* Footer */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 12
        }}>
          {/* Author */}
          <Space>
            <UserOutlined />
            <Text>{item.author}</Text>
            <Text type="secondary">
              • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Space>

          {/* Stats */}
          <Space size={12}>
            <Tooltip title="Likes">
              <Space size={4}>
                <LikeOutlined />
                <Text>{formatNumber(item.stats.likes ?? 0)}</Text>
              </Space>
            </Tooltip>

            <Tooltip title="Comments">
              <Space size={4}>
                <MessageOutlined />
                <Text>{formatNumber(item.stats.comments ?? 0)}</Text>
              </Space>
            </Tooltip>

            <Tooltip title="Views">
              <Space size={4}>
                <EyeOutlined />
                <Text>{formatNumber(item.stats.views ?? 0)}</Text>
              </Space>
            </Tooltip>
          </Space>
        </div>
      </Space>
    </Card>
  );
}