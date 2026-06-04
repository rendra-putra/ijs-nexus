import { Button, Card, Result, theme } from "antd";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        height: "100%",
        minHeight: "100%",
        padding: 32,
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: token.colorBgLayout,
      }}
    >
      <Card
        styles={{
          body: {
            padding: "32px 24px",
          },
        }}
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
        }}
      >
        <Result
          status="403"
          title="403"
          subTitle="You do not have permission to access this page."
          style={{ padding: 0 }}
          extra={
            <Link to="/home">
              <Button type="primary">Go Back Home</Button>
            </Link>
          }
        />
      </Card>
    </div>
  );
};

export default ForbiddenPage;