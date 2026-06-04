import { ConfigProvider, theme } from "antd";
import { useThemeContext } from "./contexts/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

const { defaultAlgorithm, darkAlgorithm } = theme;

export default function App() {
  const { isDark } = useThemeContext();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#d4af37',
          colorInfo: '#1e3a8a',
          fontFamily: "'Inter', sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}
