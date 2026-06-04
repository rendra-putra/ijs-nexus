import { Card, List } from "antd";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  user,
  commentValue,
  setCommentValue,
  onCommentSubmit,
  loading
}) {

  const sortedComments = [...comments].sort(
    (a, b) => Number(b.postedAt) - Number(a.postedAt)
  );

  return (
    <Card title="Comments">
      {user && (
        <CommentForm
          comment={commentValue}
          setComment={setCommentValue}
          onSubmit={onCommentSubmit}
          loading={loading}
        />
      )}

      <List
        itemLayout="horizontal"
        dataSource={sortedComments}
        renderItem={(item) => <CommentItem item={item} />}
      />
    </Card>
  );
}