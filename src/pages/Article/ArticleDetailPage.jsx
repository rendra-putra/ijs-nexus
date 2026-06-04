import { UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  App,
  Avatar,
  Card,
  Divider,
  Space,
  Spin,
  Tag,
  Typography
} from "antd";

import DOMPurify from "dompurify";
import { marked } from "marked";
import { useState } from "react";
import { useParams } from "react-router-dom";

// Context
import { useAuth } from "../../contexts/AuthContext";

// Services
import {
  ADD_ARTICLE_COMMENT,
  GET_ARTICLE_BY_SLUG
} from "../../services/articleService";

// Components
import ArticleActions from "../../components/article/ArticleActions";
import CommentList from "../../components/article/comment/CommentList";

const { Title, Text } = Typography;

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { message } = App.useApp();

  // =========================
  // STATE
  // =========================
  const [comment, setComment] = useState("");

  // =========================
  // QUERY
  // =========================
  const { data, loading, error, refetch } = useQuery(
    GET_ARTICLE_BY_SLUG,
    {
      variables: { slug },
      fetchPolicy: "network-only"
    }
  );

  const article = data?.getArticleBySlug;

  // =========================
  // MUTATION: COMMENT
  // =========================
  const [addComment, { loading: commentLoading }] = useMutation(
    ADD_ARTICLE_COMMENT,
    {
      onCompleted: () => {
        setComment("");
        refetch();
        message.success("Comment posted!");
      },
      onError: (err) => {
        message.error(err.message || "Failed to post comment");
      }
    }
  );

  // =========================
  // HANDLERS
  // =========================
  const handleAddComment = async () => {
    if (!comment.trim() || !article?.id) return;

    if (!user?.id) {
      message.warning("Please login to comment");
      return;
    }

    try {
      await addComment({
        variables: {
          articleId: article.id,
          text: comment,
          user: {
            id: user.id,
            name: user.username,
            fullName: user.fullname
          },
          userId: user.id,
          fullName: user.fullname
        }
      });
    } catch (err) {
      // already handled in onError
      console.error(err);
    }
  };

  // =========================
  // RENDER STATES
  // =========================
  if (loading && !data) {
    return <Spin fullscreen tip="Loading article..." />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  if (!article) {
    return (
      <Alert
        message="Article not found"
        description="The article may have been removed or does not exist."
        type="warning"
        showIcon
      />
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div>
      {/* ===== HEADER ===== */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Title level={2}>{article.title}</Title>

        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{article.author}</Text>
          <Text type="secondary">
            • {new Date(article.createdAt).toLocaleDateString()}
          </Text>
        </Space>

        <Divider />

        {/* 🔥 NOW FULLY SELF-CONTAINED */}
        <ArticleActions article={article} />
      </Card>

      {/* ===== COVER ===== */}
      {article.coverImage && (
        <Card
          cover={<img alt="cover" src={article.coverImage} />}
          style={{
            marginBottom: 24,
            borderRadius: 12,
            overflow: "hidden"
          }}
        />
      )}

      {/* ===== CONTENT ===== */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              marked.parse(article.content || "")
            )
          }}
        />

        <Divider />

        <Space wrap>
          {article.tags?.map((tag) => (
            <Tag key={tag} color="blue">
              #{tag}
            </Tag>
          ))}
        </Space>
      </Card>

      {/* ===== COMMENTS ===== */}
      <CommentList
        comments={article.comments}
        user={user}
        commentValue={comment}
        setCommentValue={setComment}
        onCommentSubmit={handleAddComment}
        loading={commentLoading}
      />
    </div>
  );
}