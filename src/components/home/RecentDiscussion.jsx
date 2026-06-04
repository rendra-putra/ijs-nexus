import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card, List, Space, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { GET_RECENT_DISCUSSIONS } from "../../services/homeService";

dayjs.extend(relativeTime);
const { Text } = Typography;

export default function RecentDiscussion() {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_RECENT_DISCUSSIONS, {
    variables: { limit: 3 },
  });

  const recentThreads = data?.getRecentDiscussions || [];

  return (
    <Card title="Recent Discussions" style={{ borderRadius: 12 }}>
      <List
        itemLayout="horizontal"
        dataSource={recentThreads}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: "pointer", transition: "all 0.3s" }}
            onClick={() => navigate(`/discussions/read/${item.slug}`)}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.question}
              description={
                <Space>
                  <Text>{item.questioner}</Text>
                  <Text type="secondary">
                    {dayjs(item.createdAt).fromNow()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}