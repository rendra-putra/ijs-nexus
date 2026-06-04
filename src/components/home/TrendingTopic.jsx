import React from "react";
import { FireOutlined } from "@ant-design/icons";
import { Card, List, Space, Typography, Skeleton, Alert } from "antd";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { GET_TRENDING_DISCUSSIONS } from "../../services/homeService";

const { Text } = Typography;

export default function TrendingTopic() {
  const navigate = useNavigate();
  
  const { data, loading, error } = useQuery(GET_TRENDING_DISCUSSIONS, {
    variables: { limit: 3 },
  });

  return (
    <Card 
      title={<Space><FireOutlined /> Trending Topics</Space>} 
      style={{ borderRadius: 12 }}
    >
      {loading && <Skeleton active paragraph={{ rows: 3 }} title={false} />}
      
      {error && <Alert message="Failed to load trending topics" type="error" showIcon />}

      {!loading && !error && data && (
        <List
          dataSource={data.getTrendingDiscussions}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer", transition: "all 0.3s" }}
              onClick={() => navigate(`/discussions/read/${item.slug}`)} 
            >
              <List.Item.Meta
                title={
                  <Text strong style={{ wordBreak: 'break-word' }}>
                    {item.question}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}