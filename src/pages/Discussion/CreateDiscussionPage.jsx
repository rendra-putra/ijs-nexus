import { useMutation } from "@apollo/client/react";
import {
  App,
  Card,
  Form,
  Typography,
  Grid
} from "antd";
import { useNavigate } from "react-router-dom";

import DiscussionForm from "../../components/discussion/DiscussionForm";
import { useAuth } from "../../contexts/AuthContext";
import { CREATE_DISCUSSION } from "../../services/discussionService";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function CreateDiscussionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const screens = useBreakpoint();

  const [createDiscussion, { loading }] =
    useMutation(CREATE_DISCUSSION);

  const handleCreate = async (values) => {
    try {
      const { data } = await createDiscussion({
        variables: {
          input: {
            ...values,
            questioner: user.fullname,
            userId: user.id
          },
          userId: user.id,
          fullName: user.fullname
        }
      });

      message.success("Discussion created!");
      navigate(`/discussions/read/${data.createDiscussion.slug}`);
    } catch {
      message.error("Failed to create discussion");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: screens.xs ? 12 : 16
      }}
    >
      {/* TITLE */}
      <Title
        level={2}
        style={{
          margin: 0,
          fontSize: screens.xs ? 20 : 26
        }}
      >
        Ask a Public Question
      </Title>

      {/* FORM CARD */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: screens.xl ? 1000 : "100%", // 🔥 adaptive
            borderRadius: 12
          }}
          bodyStyle={{
            padding: screens.xs ? 16 : 24 // 🔥 padding responsive
          }}
        >
          <DiscussionForm
            form={form}
            onSubmit={handleCreate}
            loading={loading}
            submitText="Post Question"
          />
        </Card>
      </div>
    </div>
  );
}