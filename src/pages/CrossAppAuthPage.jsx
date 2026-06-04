import { Card, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { refreshTokenRequest } from "../services/authService";

const { Title, Text } = Typography;

const CrossAppAuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { applyAuth, logout, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const handleCrossAppAuth = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const data = await refreshTokenRequest(token);

        if (!isMounted) return;

        applyAuth(data.accessToken, data.refreshToken);
      } catch (err) {
        console.error("Cross-app login failed:", err);

        if (!isMounted) return;

        logout();
        navigate("/", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    handleCrossAppAuth();

    return () => {
      isMounted = false;
    };
  }, [searchParams, navigate, applyAuth, logout]);

  // Redirect AFTER auth state updates
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Loading UI (Ant Design)
  if (loading) {
    return (
      <div style={styles.container}>
        <Card style={styles.card} bordered={false}>
          <div style={styles.content}>
            <Spin size="large" tip="Authenticating..." />
            <Title level={4} style={{ marginTop: 16 }}>
              Signing you in...
            </Title>
            <Text type="secondary">
              Please wait while we authenticate your session.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return null;
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  card: {
    width: 360,
    borderRadius: 12,
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 0",
  },
};

export default CrossAppAuthPage;