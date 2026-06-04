import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  MoreOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Grid,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useThemeContext } from "../../contexts/ThemeContext";

const { Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = ({
  collapsed,
  setCollapsed,
  setMobileOpen,
}) => {
  const { isDark, toggleTheme } = useThemeContext();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const mobileMenuItems = [
    {
      key: "theme",
      icon: isDark ? <SunOutlined /> : <MoonOutlined />,
      label: isDark ? "Light Mode" : "Dark Mode",
      onClick: toggleTheme,
    },
    ...(isAuthenticated
      ? [
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          onClick: handleLogout,
        },
      ]
      : []),
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInline: screens.xs ? 12 : 20,
        height: 64,
        background: isDark ? "#1f1f1f" : "#f5f5f5",
        color: isDark ? "#fff" : "#000",
        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid #e0e0e0",
      }}
    >
      {/* LEFT */}
      <Space size={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.svg" alt="IJS Nexus Logo" style={{ height: 36 }} />
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Inter', sans-serif", color: isDark ? '#d4af37' : '#1e3a8a', lineHeight: 1, whiteSpace: "nowrap" }}>
              IJS Nexus
            </div>
            {screens.sm && (
              <div style={{ fontSize: 10, color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, whiteSpace: "nowrap", lineHeight: 1 }}>
                Integrated Justice System
              </div>
            )}
          </div>
        </div>

        <Tooltip
          title={screens.lg ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : null}
        >
          <Button
            type="text"
            icon={
              screens.lg
                ? collapsed
                  ? <MenuUnfoldOutlined />
                  : <MenuFoldOutlined />
                : <MenuOutlined />
            }
            onClick={() => {
              if (screens.lg) {
                setCollapsed(!collapsed);
              } else {
                setMobileOpen(true);
              }
            }}
            style={{
              color: isDark ? "white" : "black",
              width: 40,
              height: 40,
            }}
          />
        </Tooltip>
      </Space>

      {/* RIGHT DESKTOP */}
      {screens.md ? (
        <Space size={24}>
          {isAuthenticated && user && (
            <Space align="center">
              <Avatar
                size={36}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: isDark ? "#444" : "#d9d9d9",
                  border: `2px solid ${isDark ? "#444" : "#d9d9d9"}`,
                }}
              />

              <div style={{ lineHeight: 1 }}>
                <Text strong style={{ color: isDark ? "#fff" : "#000" }}>
                  {user.fullname}
                </Text>
                <br />
                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                    color: isDark ? "#ccc" : "#666",
                  }}
                >
                  {user.roles?.[0] || "User"}
                </Text>
              </div>
            </Space>
          )}

          <Tooltip title={isDark ? "Light Mode" : "Dark Mode"}>
            <Button
              type="text"
              onClick={toggleTheme}
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              style={{ color: isDark ? "white" : "black" }}
            />
          </Tooltip>

          {isAuthenticated && (
            <Tooltip title="Logout">
              <Button
                type="text"
                onClick={handleLogout}
                icon={<LogoutOutlined />}
                style={{ color: isDark ? "white" : "black" }}
              />
            </Tooltip>
          )}
        </Space>
      ) : (
        /* MOBILE DROPDOWN */
        <Dropdown
          menu={{ items: mobileMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{ color: isDark ? "white" : "black" }}
          />
        </Dropdown>
      )}
    </Header>
  );
};

export default AppHeader;