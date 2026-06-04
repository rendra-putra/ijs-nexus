import { useMutation } from "@apollo/client/react";
import { Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import ArticleForm from "../../components/article/ArticleForm";
import { useAuth } from "../../contexts/AuthContext";
import { CREATE_ARTICLE } from "../../services/articleService";

export default function CreateArticlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [createArticle, { loading }] = useMutation(CREATE_ARTICLE, {
    onCompleted: () => {
      message.success("Article created successfully!");
      navigate("/my-articles");
    },
    onError: (err) => {
      message.error(err.message || "Failed to create article");
    },
  });

  const handleSubmit = (values) => {
    createArticle({
      variables: {
        title: values.title,
        coverImage: values.coverImage || null,
        tags: values.tags || [],
        content: values.content,
        userId: user.id,
        author: user.fullname,
      },
    });
  };

  return (
    <Card>
      <ArticleForm
        onSubmit={handleSubmit}
        loading={loading}
        title="Create New Article"
        submitText="Create Article"
      />
    </Card>
  );
}
