import { App as AntApp } from "antd"; // ✅ tambahkan ini
import 'antd/dist/reset.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AntApp> {/* ✅ WAJIB */}
            <App />
           </AntApp>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
