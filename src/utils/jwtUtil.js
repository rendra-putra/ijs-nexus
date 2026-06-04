// src/utils/jwtUtil.js

export const decodeJwt = (token) => {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};
