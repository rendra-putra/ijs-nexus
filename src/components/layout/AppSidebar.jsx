import { Drawer, Grid, Layout, Menu } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { sidebarMenu } from "../../data/sidebarMenu.jsx";
import { hasRole } from "../../helpers/roleHelper";
import "../../styles/sidebar.css";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

export default function AppSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const screens = useBreakpoint();

  const [manualOpenKeys, setManualOpenKeys] = useState([]);

  const mapMenuItem = (item) => {
    if (item.children) {
      const isParentActive =
        collapsed &&
        item.children.some((child) =>
          location.pathname.startsWith(child.key)
        );

      return {
        key: item.key,
        icon: item.icon,
        label: item.text,
        className: isParentActive ? "sidebar-parent-active" : "",
        children: item.children
          .filter((child) => hasRole(user, child.roles))
          .map((child) => ({
            key: child.key,
            label: <Link to={child.path}>{child.text}</Link>,
          })),
      };
    }

    return {
      key: item.key,
      icon: item.icon,
      label: <Link to={item.path}>{item.text}</Link>,
    };
  };

  const visibleItems = sidebarMenu
    .filter((item) => hasRole(user, item.roles))
    .map(mapMenuItem);

  const flatKeys = sidebarMenu.flatMap((item) =>
    item.children ? item.children.map((c) => c.key) : [item.key]
  );

  const childActiveKey =
    flatKeys
      .filter((key) => location.pathname.startsWith(key))
      .sort((a, b) => b.length - a.length)[0] || "";

  const autoOpenKeys = sidebarMenu
    .filter((item) =>
      item.children?.some((child) =>
        location.pathname.startsWith(child.key)
      )
    )
    .map((item) => item.key);

  const menu = (
    <Menu
      theme="dark"
      mode="inline"
      items={visibleItems}
      selectedKeys={[childActiveKey]}
      openKeys={
        collapsed
          ? undefined
          : manualOpenKeys.length
          ? manualOpenKeys
          : autoOpenKeys
      }
      onOpenChange={(keys) => setManualOpenKeys(keys)}
      onClick={() => {
        if (!screens.lg) setMobileOpen(false);
      }}
    />
  );

  if (!screens.lg) {
    return (
      <Drawer
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        bodyStyle={{ padding: 0 }}
        width={250}
      >
        {menu}
      </Drawer>
    );
  }

  return (
    <Sider
      collapsible
      trigger={null}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedWidth={80}
    >
      {menu}
    </Sider>
  );
}