import { createContext, useContext, useEffect, useState } from "react";
import UserModel from "../models/userModel";
import {
  exchangeSSOTokenRequest,
  loginRequest,
} from "../services/authService";
import { decodeJwt } from "../utils/jwtUtil";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyAuth = (accessToken, refreshToken) => {
    localStorage.setItem("access_token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    const decoded = decodeJwt(accessToken);
    const user = UserModel.fromJwt(decoded);

    setUser(user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const access = localStorage.getItem("access_token");

    if (access) {
      const decoded = decodeJwt(access);

      if (decoded && decoded.exp * 1000 > Date.now()) {
        const user = UserModel.fromJwt(decoded);
        setUser(user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Demo Account Bypass
    if (username === "justice-demo" && password === "australia") {
      const demoPayload = {
        id: "demo-user-123",
        username: "justice-demo",
        fullname: "Justice Demo User",
        authorities: [{ authority: "Admin" }],
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) // 1 year validity
      };
      // Create a valid JWT structure so decodeJwt and localStorage persistence works
      const encodedPayload = btoa(JSON.stringify(demoPayload));
      const demoToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.demoSignature`;
      
      applyAuth(demoToken, demoToken);
      return { accessToken: demoToken, refreshToken: demoToken };
    }

    const data = await loginRequest(username, password);
    applyAuth(data.accessToken, data.refreshToken);
    return data;
  };

  const loginWithSSO = async (code) => {
    const redirectUri = `${window.location.origin}/oauth-success`;

    const data = await exchangeSSOTokenRequest(code, redirectUri);

    applyAuth(data.accessToken, data.refreshToken);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithSSO,
        logout,
        loading,
        applyAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (ctx === null) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Wrap your app with <AuthProvider>."
    );
  }

  return ctx;
};