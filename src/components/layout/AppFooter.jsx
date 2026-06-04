// src/components/layout/AppFooter.jsx
import {
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Grid, Layout, Space, Typography } from "antd";
import { useThemeContext } from "../../contexts/ThemeContext";

const { Footer } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AppFooter = () => {
  const { isDark } = useThemeContext();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <Footer
      style={{
        textAlign: "center",
        padding: "24px 12px",

        // 🌟 Visible boundary between content & sidebar
        borderTop: isDark
          ? "1px solid rgba(255, 255, 255, 0.25)"
          : "1px solid rgba(0, 0, 0, 0.15)",

        // Slight background tint for separation
        background: isDark ? "#141414" : "#fafafa",
      }}
    >
      <Space direction="vertical" size={8}>
        <Space size="large">
          <a href="https://linkedin.com/in/rendra-ap" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            <LinkedinOutlined style={{ fontSize: 20 }} />
          </a>
          <a href="mailto:rendra2p@gmail.com" style={{ color: "inherit" }}>
            <MailOutlined style={{ fontSize: 20 }} />
          </a>
        </Space>

        <Text
          type="secondary"
          style={{
            fontSize: isMobile ? 12 : 13,
            lineHeight: 1.5,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "auto auto",
              gap: isMobile ? 0 : 6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>© {new Date().getFullYear()} Integrated Justice System</span>
            {/* <span>Built with ❤️ using Ant Design</span> */}
          </div>
        </Text>
      </Space>
    </Footer>
  );
};

export default AppFooter;
