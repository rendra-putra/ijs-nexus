import { Card, Result, Spin, Typography } from "antd";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Text } = Typography;

const OAuthSuccessPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithSSO } = useAuth();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const savedState = sessionStorage.getItem("oauth_state");

    const run = async () => {
      try {
        if (!code) {
          throw new Error("Missing OAuth code. Please try again.");
        }

        if (state !== savedState) {
          throw new Error("Security validation failed. Please login again.");
        }

        await loginWithSSO(code);

        sessionStorage.removeItem("oauth_state");

        navigate("/home", { replace: true });
      } catch (err) {
        navigate("/login", {
          replace: true,
          state: {
            error: err.message || "SSO login failed"
          }
        });
      }
    };

    run();
  }, [params, loginWithSSO, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef4ff 0%, #ffffff 100%)",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <Result
          icon={<Spin size="large" />}
          title="Signing you in"
          subTitle={
            <Text type="secondary">
              Please wait while we complete your SSO authentication...
            </Text>
          }
        />
      </Card>
    </div>
  );
};

export default OAuthSuccessPage;