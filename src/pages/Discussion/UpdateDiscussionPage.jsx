import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  App,
  Card,
  Form,
  Spin,
  Typography
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import DiscussionForm from "../../components/discussion/DiscussionForm";
import { useAuth } from "../../contexts/AuthContext";
import {
  GET_DISCUSSION_BY_ID,
  UPDATE_DISCUSSION,
} from "../../services/discussionService";

const { Title } = Typography;

export default function UpdateDiscussionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { message } = App.useApp();

  const [form] = Form.useForm();

  const { data, loading, error } = useQuery(
    GET_DISCUSSION_BY_ID,
    { variables: { id } }
  );

  const [updateDiscussion, { loading: updating }] =
    useMutation(UPDATE_DISCUSSION);

  const discussion = data?.discussionById;

  const handleUpdate = async (values) => {
    try {
      const { data: updated } = await updateDiscussion({
        variables: {
          id: discussion.id,
          fullname: user.fullname,
          input: {
            question: values.question,
            detail: values.detail,
            tags: values.tags,
          },
        },
      });

      message.success("Discussion updated!");

      navigate(
        `/discussions/read/${updated.updateDiscussion.slug}`
      );
    } catch (err) {
      console.error(err);
      message.error("Failed to update discussion");
    }
  };

  if (loading) return <Spin fullscreen />;

  if (error) return (
    <Alert
      description={error.message}
      type="error"
    />
  );

  return (
    <div>
      <Title level={2}>Edit Discussion</Title>

      <Card style={{ borderRadius: 12 }}>
        <DiscussionForm
          form={form}
          initialValues={discussion}
          onSubmit={handleUpdate}
          loading={updating}
          submitText="Update Discussion"
        />
      </Card>
    </div>
  );
}
