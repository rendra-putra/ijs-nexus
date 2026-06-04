import { Button, Card, Divider, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/login/LoginForm";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, user } = useAuth();
  const { isDark } = useThemeContext();

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // =========================
  // 🔥 REDIRECT IF LOGGED IN
  // =========================
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  // =========================
  // 🔥 FLASH ERROR FROM OAUTH
  // =========================
  useEffect(() => {
    const errorMessage = location.state?.error;

    if (errorMessage) {
      messageApi.error(errorMessage);

      // clear state so it won't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, messageApi]);

  // =========================
  // STYLES
  // =========================
  const bgColor = isDark ? "#141414" : "#f8fafd";

  const dotPattern = isDark
    ? "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)"
    : "radial-gradient(rgba(22, 119, 255, 0.15) 1px, transparent 1px)";

  const cardBg = isDark ? "rgba(30, 30, 30, 0.75)" : "#ffffff";

  const cardBorder = isDark
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.05)";

  // =========================
  // LOGIN HANDLER
  // =========================
  const handleLogin = async (values) => {
    setLoading(true);

    try {
      await login(values.username, values.password);

      messageApi.success("Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      if (
        err.status === 401 ||
        err.message?.toLowerCase().includes("unauthorized")
      ) {
        messageApi.error("Incorrect username or password. Please try again.");
      } else {
        messageApi.error(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // UI
  // =========================
  return (
    <>
      {contextHolder}

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: bgColor,
          backgroundImage: dotPattern,
          backgroundSize: "24px 24px",
          transition: "background 0.3s ease",
        }}
      >
        <Card
          style={{
            width: 380,
            padding: "32px 28px",
            borderRadius: 16,
            backdropFilter: "blur(16px)",
            background: cardBg,
            border: cardBorder,
            boxShadow: isDark
              ? "0 12px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.2)"
              : "0 8px 20px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
          }}
        >
          <Title
            level={3}
            style={{
              textAlign: "center",
              marginBottom: 10,
              color: isDark ? "#ffffff" : "inherit",
            }}
          >
            Welcome Back
          </Title>

          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 24,
              color: isDark ? "#a6a6a6" : undefined,
            }}
          >
            Login to continue to your forum
          </Text>

          <LoginForm loading={loading} onSubmit={handleLogin} />


        </Card>
      </div>
    </>
  );
};

export default LoginPage;