import { useMutation, useQuery } from "@apollo/client/react";
import { Alert, Card, Spin, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import ArticleForm from "../../components/article/ArticleForm";
import { GET_ARTICLE_BY_ID, UPDATE_ARTICLE } from "../../services/articleService";

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { id },
  });

  const [updateArticle, { loading: updating }] = useMutation(UPDATE_ARTICLE, {
    onCompleted: () => {
      message.success("Article updated!");
      navigate(-1);
    },
    onError: (err) => message.error(err.message),
  });

  if (loading) return <Spin fullscreen />;

  if (error) return (
    <Alert
      description={error.message}
      type="error"
    />
  );

  const article = data?.getArticleById;

  const handleSubmit = (values) => {
    updateArticle({
      variables: {
        id,
        ...values,
      },
    });
  };

  return (
    <Card>
      <ArticleForm
        title="Edit Article"
        submitText="Update Article"
        loading={updating}
        initialValues={{
          title: article.title,
          tags: article.tags,
          content: article.content,
          coverImage: article.coverImage,
        }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
