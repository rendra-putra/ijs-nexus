// src/components/login/LoginForm.jsx
import { Button, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const LoginForm = ({ loading, onSubmit }) => {
  const [form] = Form.useForm();
  const [isValid, setIsValid] = useState(false);

  // Check form validation on every change
  const handleValuesChange = () => {
    const hasErrors = form
      .getFieldsError()
      .some((field) => field.errors.length > 0);

    const hasEmpty = !form.getFieldValue("username") || !form.getFieldValue("password");

    setIsValid(!hasErrors && !hasEmpty);
  };

  // Initial check when component mounts
  useEffect(() => {
    handleValuesChange();
  }, []);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label={<span style={{ fontWeight: 500 }}>Username</span>}
        name="username"
        rules={[{ required: true, message: "Please enter your username" }]}
      >
        <Input size="large" placeholder="Enter your username" />
      </Form.Item>

      <Form.Item
        label={<span style={{ fontWeight: 500 }}>Password</span>}
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password size="large" placeholder="Enter your password" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
        loading={loading}
        disabled={loading}
        size="large"
        style={{
          marginTop: 8,
          height: 48,
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
