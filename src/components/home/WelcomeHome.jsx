import {
  Card,
  Typography
} from "antd";


const { Title, Text } = Typography;

export default function WelcomeHome() {
  return (
    <Card style={{ marginBottom: 24, borderRadius: 12, border: '1px solid rgba(212, 175, 55, 0.2)' }}>
      <Title level={3} style={{ fontFamily: "'Inter', sans-serif" }}>Welcome to IJS Nexus ⚖️</Title>
      <Text type="secondary">
        Here's a quick overview of the latest inclusive justice data and discussions.
      </Text>
    </Card>
  );
}