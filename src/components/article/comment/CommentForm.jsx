import { Row, Col, Input, Button, Divider } from "antd";

export default function CommentForm({ comment, setComment, onSubmit, loading }) {
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input.TextArea
            rows={3}
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            loading={loading}
            disabled={!comment.trim()}
            onClick={onSubmit}
          >
            Post Comment
          </Button>
        </Col>
      </Row>
      <Divider />
    </>
  );
}