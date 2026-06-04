import { getEnv } from "../config/env";

const BASE_URL = `${getEnv("VITE_API_ENGINE_URL")}/ai/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getChatHistoryRequest = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/history-justice/${sessionId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to fetch history");
    error.status = response.status;
    throw error;
  }

  return data;
};  

export const createSessionRequest = async () => {
  const response = await fetch(`${BASE_URL}/session-justice`, {
    method: "POST",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to create new session");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const sendCompletionRequest = async (question, sessionId, stream = false) => {
  const response = await fetch(`${BASE_URL}/completion-justice`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      question,
      stream,
      session_id: sessionId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.message || "Failed to send message");
    error.status = response.status;
    throw error;
  }

  return data;
};