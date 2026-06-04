import { getEnv } from "../config/env";

const BASE_URL = getEnv("VITE_API_BASE_URL");

export const loginRequest = async (username, password) => {
  const response = await fetch(`${BASE_URL}/auth/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Login failed");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const exchangeSSOTokenRequest = async (code, redirectUri) => {
  const response = await fetch(`${BASE_URL}/auth/api/v1/auth/login-sso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      redirectUri,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "SSO login failed");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const refreshTokenRequest = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/api/v1/auth/refresh?token=${token}`, {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to get new token");
    error.status = response.status;
    throw error;
  }

  return data;
};