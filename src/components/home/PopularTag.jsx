import React from "react";
import {
  Card,
  Space,
  Tag
} from "antd";
import { useQuery } from "@apollo/client/react";

import { GET_POPULAR_TAGS } from "../../services/homeService";

export default function PopularTag() {
  const { data } = useQuery(GET_POPULAR_TAGS, {
    variables: { limit: 7 },
  });

  const popularTags = data?.getPopularTags || [];

  return (
    <Card
      title="Popular Tags"
      style={{ marginTop: 24, borderRadius: 12 }}
    >
      <Space wrap>
        {popularTags.map((tag) => (
          <Tag color="blue" key={tag} style={{ padding: "6px 12px", fontSize: 14 }}>
            #{tag}
          </Tag>
        ))}
        {popularTags.length === 0 && (
          <span style={{ color: "#999", fontSize: 14 }}>No tags yet</span>
        )}
      </Space>
    </Card>
  );
}