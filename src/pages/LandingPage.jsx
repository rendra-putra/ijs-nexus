import { Button, Card, Grid, Layout, Typography } from "antd";
import { Link } from "react-router-dom";
import LandingHeader from "../components/landing-page/LandingHeader";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const LandingPage = () => {
  const { isDark } = useThemeContext();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // ✅ Breakpoint for responsive UI
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const bgColor = isDark ? "#141414" : "#f8fafd";

  const dotPattern = isDark
    ? "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)"
    : "radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px)";

  const cardBg = isDark
    ? "rgba(11, 36, 71, 0.75)"
    : "rgba(255, 255, 255, 0.85)";

  const cardBorder = isDark
    ? "1px solid rgba(212, 175, 55, 0.2)"
    : "1px solid rgba(212, 175, 55, 0.3)";

  const textColor = isDark ? "#e0e0e0" : "#555";

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <LandingHeader />

      <Content
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: screens.xs ? "40px 16px" : "60px 20px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: bgColor,
          backgroundImage: dotPattern,
          backgroundSize: "24px 24px",
          transition: "background 0.3s ease",
        }}
      >
        {/* Background Glow */}
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: isDark
              ? "rgba(212, 175, 55, 0.08)"
              : "rgba(212, 175, 55, 0.12)",
            top: "-100px",
            right: "-100px",
            filter: "blur(70px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: isDark
              ? "rgba(30, 58, 138, 0.2)"
              : "rgba(30, 58, 138, 0.1)",
            bottom: "-80px",
            left: "-80px",
            filter: "blur(70px)",
          }}
        />

        {/* Main Card */}
        <Card
          style={{
            padding: screens.xs ? "32px 20px" : "50px 50px",
            maxWidth: 650,
            width: "100%",
            textAlign: "center",
            borderRadius: 20,
            backdropFilter: "blur(16px)",
            background: cardBg,
            border: cardBorder,
            boxShadow: isDark
              ? "0 12px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(212,175,55,0.1)"
              : "0 12px 32px rgba(30,58,138,0.08), 0 4px 12px rgba(0,0,0,0.02)",
            transition: "all 0.3s ease",
          }}
        >
          {/* ✅ Responsive Title */}
          <Title
            level={1}
            style={{
              fontFamily: "'Playfair Display', serif",
              marginBottom: 16,
              fontSize: screens.xs
                ? "1.8rem"
                : screens.sm
                  ? "2.2rem"
                  : "2.6rem",
              fontWeight: 800,
              lineHeight: screens.xs ? 1.3 : 1.2,
              color: isDark ? "#ffffff" : "#1e3a8a",
              letterSpacing: screens.xs ? "0px" : "-0.5px",
            }}
          >
            Welcome to{" "}
            <span style={{ color: "#d4af37" }}>
              IJS Nexus
            </span>
          </Title>

          <Paragraph
            style={{
              fontSize: screens.xs ? 14 : 16,
              color: textColor,
              margin: "0 auto 36px",
              maxWidth: 540,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: isDark ? '#d4af37' : '#1e3a8a', fontSize: '1.1em' }}>Inclusive Justice Data Access</strong><br />
            Explore, analyze, and collaborate on statistical data to build a more transparent and equitable justice system.
          </Paragraph>

          <Link to={isLoggedIn ? "/home" : "/login"}>
            <Button
              type="primary"
              size="large"
              style={{
                padding: screens.xs ? "0 20px" : "0 30px",
                height: 50,
                borderRadius: 8,
                fontSize: screens.xs ? 14 : 16,
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(212, 175, 55, 0.3)",
              }}
            >
              {isLoggedIn ? "Go to Homepage" : "Get Started"}
            </Button>
          </Link>

          <Paragraph style={{ marginTop: 32, marginBottom: 0 }}>
            <Text
              style={{
                color: isDark ? "#888" : "#999",
                fontSize: 14,
                fontWeight: 500
              }}
            >
              Search. Ask. Collaborate.
              <br />
              Build the Future of Data Together.
            </Text>
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
};

export default LandingPage;