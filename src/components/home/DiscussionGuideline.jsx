import {
  BulbOutlined,
  MessageOutlined,
  SafetyOutlined,
  StopOutlined
} from "@ant-design/icons";
import { Card, List, Tag, Typography } from "antd";

const { Text } = Typography;

const guidelines = [
  {
    icon: <MessageOutlined />,
    title: "Be respectful",
    description: "Treat other members with respect and maintain a positive discussion."
  },
  {
    icon: <BulbOutlined />,
    title: "Stay on topic",
    description: "Ensure your replies contribute to the topic being discussed."
  },
  {
    icon: <SafetyOutlined />,
    title: "Share helpful insights",
    description: "Provide constructive answers, solutions, or useful resources."
  },
  {
    icon: <StopOutlined />,
    title: "No spam or promotion",
    description: "Avoid posting advertisements or unrelated promotional content."
  }
];

export default function DiscussionGuideline() {
  return (
    <Card
      title="Discussion Guidelines"
      size="small"
      extra={<Tag color="blue">Community</Tag>}
    >
      <List
        itemLayout="horizontal"
        dataSource={guidelines}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={item.icon}
              title={<Text strong>{item.title}</Text>}
              description={<Text type="secondary">{item.description}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}