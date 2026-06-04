import {
  MessageOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@apollo/client/react";
import {
  Button,
  Card,
  Input,
  List,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import { GET_POSTS } from "../services/postService";

const { Title, Text } = Typography;

export default function DiscussionPage() {
  const [search, setSearch] = useState("");

  // Fetch posts from GraphQL
  const { data, loading, error } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const posts = data?.posts ?? [];

  // Search filter
  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header section */}
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={2}>Forum Discussions</Title>

        <Button type="primary" icon={<PlusOutlined />} size="large">
          Create Thread
        </Button>
      </Space>

      {/* Search Bar */}
      <Input
        size="large"
        placeholder="Search threads..."
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {/* Thread List */}
      <Card>
        <List
          itemLayout="vertical"
          dataSource={filteredPosts}
          renderItem={(item) => (
            <Card
              key={item.id}
              style={{ marginBottom: 16, borderRadius: 10 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {/* Title */}
                <Title level={4} style={{ margin: 0 }}>
                  {item.title}
                </Title>

                {/* Tags */}
                <Space>
                  {item.tags.map((tag) => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </Space>

                {/* Footer Meta */}
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: 8,
                  }}
                >
                  <Space>
                    <UserOutlined />
                    <Text>{item.author}</Text>
                    <Text type="secondary">
                      • {new Date(Number(item.createdAt)).toISOString().split("T")[0]}
                    </Text>
                  </Space>

                  <Space>
                    <MessageOutlined />
                    <Text>{item.replies} Replies</Text>
                  </Space>
                </Space>
              </Space>
            </Card>
          )}
        />
      </Card>
    </div>
  );
}
