import {
  FlagOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  Typography,
  message,
  theme,
} from "antd";

import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../contexts/AuthContext";
import { ADD_REPORT } from "../../services/reportService";

const { Title, Text } = Typography;

const REPORT_REASONS = [
  { value: "harassment", label: "Harassment / Bullying" },
  { value: "spam", label: "Spam / Advertising" },
  { value: "hate", label: "Hate Speech" },
  { value: "nsfw", label: "NSFW / Adult Content" },
  { value: "impersonation", label: "Impersonation" },
  { value: "illegal", label: "Illegal Activities" },
  { value: "other", label: "Other" },
];

export default function ReportModal({
  open,
  onCancel,
  reportedUser,
  reference,
}) {
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const { user } = useAuth();

  const [addReport, { loading }] = useMutation(ADD_REPORT);

  const handleSubmit = async (values) => {
    try {
      await addReport({
        variables: {
          user: {
            id: reportedUser.id,
            fullName: reportedUser.fullname,
          },
          reporter: {
            id: user.id,
            fullName: user.fullname,
          },
          reason: values.category,
          detail: values.details,
          reference: {
            kind: reference.kind,
            id: reference.id,
          },
        },
      });

      message.success(
        "Your report has been submitted. Our moderators will review it."
      );

      form.resetFields();
      onCancel();
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={540}
      title={
        <Space>
          <FlagOutlined style={{ color: token.colorError }} />
          <span>Report User</span>
        </Space>
      }
    >
      <Text type="secondary">
        Help us keep the community safe. Reports are reviewed confidentially by moderators.
      </Text>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: token.colorBgContainer,
          borderRadius: 10,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Space size="middle" align="center">
          <Avatar
            size={56}
            icon={<UserOutlined />}
            src={reportedUser?.avatar}
          />

          <div>
            <Title level={5} style={{ margin: 0 }}>
              {reportedUser?.fullname}
            </Title>
          </div>
        </Space>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Text type="secondary">Reference</Text>

          <Tag color="blue" style={{ margin: 0 }}>
            {reference?.kind}
          </Tag>
        </div>

        <div style={{ marginTop: 4 }}>
          <Text ellipsis={{ tooltip: reference?.snippet }}>
            {reference?.snippet}
          </Text>
        </div>
      </div>

      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="category"
          label="Reason for Report"
          rules={[
            {
              required: true,
              message: "Please select a reason.",
            },
          ]}
        >
          <Select
            placeholder="Select violation"
            options={REPORT_REASONS}
          />
        </Form.Item>

        <Form.Item
          name="details"
          label="Additional Details"
          rules={[
            {
              required: true,
              message: "Please provide more information.",
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Describe what happened..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            danger
            htmlType="submit"
            block
            size="large"
            loading={loading}
          >
            <WarningOutlined />
            Submit Report
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}