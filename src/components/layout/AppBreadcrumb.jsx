import { Breadcrumb, theme } from "antd";
import { Link, useLocation } from "react-router-dom";
import { routeMap } from "../../data/breadcrumbMap";

export default function AppBreadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;
  const { token } = theme.useToken();

  // Ensure child routes match first
  const sortedKeys = Object.keys(routeMap).sort((a, b) => b.length - a.length);

  const matchedKey = sortedKeys.find((key) =>
    pathname.startsWith(key)
  );

  if (!matchedKey) return null;

  const routes = routeMap[matchedKey];

  const items = routes.map((item, index) => {
    const isLast = index === routes.length - 1;

    const title = (
      <>
        {item.icon}
        <span style={{ marginLeft: 6 }}>{item.label}</span>
      </>
    );

    return {
      title: item.path && !isLast ? (
        <Link to={item.path}>{title}</Link>
      ) : (
        title
      ),
    };
  });

  return (
    <Breadcrumb
      separator="›"
      style={{
        marginBottom: 24,
        padding: "14px 20px",
        background: token.colorBgContainer,
        borderRadius: 10,
        fontSize: 16,
      }}
      items={items}
    />
  );
}