import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
// 1. Import Theme Context-mu
import { useThemeContext } from "../contexts/ThemeContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isDark } = useThemeContext();

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: isDark ? '#141414' : '#ffffff' 
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist or the URL is incorrect."
        extra={
          <Button type="primary" onClick={() => navigate("/home")} size="large">
            Back to Home
          </Button>
        }
      />
    </div>
  );
}