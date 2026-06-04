import { getEnv } from "../config/env";

const BASE_URL = `${getEnv("VITE_API_ENGINE_URL")}/ai/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getChatHistoryRequest = async (sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/history-justice/${sessionId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Fallback to dummy");
    
    return await response.json();
  } catch (error) {
    console.warn("Backend unreachable, returning dummy history.", error);
    return { messages: [] };
  }
};  

export const createSessionRequest = async () => {
  try {
    const response = await fetch(`${BASE_URL}/session-justice`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("Fallback to dummy");

    return await response.json();
  } catch (error) {
    console.warn("Backend unreachable, returning dummy session.", error);
    return { data: { id: `dummy-session-${Date.now()}` } };
  }
};

export const sendCompletionRequest = async (question, sessionId, stream = false) => {
  try {
    const response = await fetch(`${BASE_URL}/completion-justice`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        question,
        stream,
        session_id: sessionId,
      }),
    });

    if (!response.ok) throw new Error("Fallback to dummy");

    return await response.json();
  } catch (error) {
    console.warn("Backend unreachable, returning dummy completion.", error);
    await delay(1500); // Simulate network delay
    
    // Generate a contextual dummy response
    const dummyAnswers = [
      "Menurut pasal-pasal terkait, tindakan tersebut dapat dikenakan sanksi sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia.",
      "Sebagai AI versi demo (dummy mode), saya tidak terhubung dengan database aktual saat ini. Namun secara umum, hukum di Indonesia mengatur hal tersebut secara ketat.",
      "Pertanyaan yang bagus. Dalam konteks Sistem Peradilan Pidana, hal ini melibatkan beberapa tahapan mulai dari penyidikan hingga putusan pengadilan.",
      "Maaf, saat ini saya berjalan dalam Mode Demo karena server utama sedang tidak dapat dijangkau. Saya hanya bisa memberikan jawaban simulasi."
    ];
    
    let answer = dummyAnswers[Math.floor(Math.random() * dummyAnswers.length)];
    if (question.toLowerCase().includes("halo") || question.toLowerCase().includes("hai")) {
      answer = "Halo! Saya adalah Asisten AI IJS Nexus. Saat ini saya berjalan dalam *Mode Demo* (backend tidak terhubung). Ada yang bisa saya bantu secara simulasi?";
    }

    return { data: { content: answer } };
  }
};