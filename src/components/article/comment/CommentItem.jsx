import { List, Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function CommentItem({ item }) {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <Space direction="vertical" size={0}>
            <Text strong>{item.user.fullName || item.user.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(Number(item.postedAt)).toLocaleDateString()}
            </Text>
          </Space>
        }
        description={item.text}
      />
    </List.Item>
  );
}