import { Grid, Layout } from "antd";
import { useEffect, useState } from "react";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function MainLayout({ children, fullScreen = false }) {
  const screens = useBreakpoint();

  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* HEADER */}
      <AppHeader
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* BODY */}
      <Layout
        hasSider
        style={{
          flex: 1,
          overflow: "hidden",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        {/* SIDEBAR */}
        <AppSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* CONTENT */}
        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Content
            style={{
              flex: 1,
              overflowY: fullScreen ? "hidden" : "auto",
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {fullScreen ? (
              /* Full-screen mode: no breadcrumb, no footer, no padding */
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                {children}
              </div>
            ) : (
              <>
                <div style={{ flex: 1, padding: 24 }}>
                  {/* PAGE CONTENT */}
                  <div style={{ flex: 1 }}>
                    {children}
                  </div>
                </div>

                <AppFooter />
              </>
            )}
          </Content>
        </Layout>

      </Layout>
    </Layout>
  );
}