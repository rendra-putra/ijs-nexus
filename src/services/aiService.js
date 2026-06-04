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
    
    if (sessionId === 'demo-kuhp' || true) {
      return {
        messages: [
          {
            id: "msg-1",
            role: "user",
            content: "Halo, bisa jelaskan apa saja perubahan utama dalam KUHP Baru (UU No. 1 Tahun 2023)?",
            created_at: Date.now() / 1000 - 3600
          },
          {
            id: "msg-2",
            role: "assistant",
            content: "Tentu! KUHP Baru (UU No. 1 Tahun 2023) dirancang untuk menggantikan KUHP peninggalan kolonial Belanda. Beberapa perubahan utamanya meliputi:\n\n1. **Keadilan Restoratif (Restorative Justice):** Mengedepankan pemulihan kerugian korban daripada sekadar penghukuman.\n2. **Tindak Pidana Khusus:** Mengatur korupsi, terorisme, dan pelanggaran HAM berat yang sebelumnya diatur terpisah.\n3. **Living Law (Hukum yang Hidup):** Mengakui hukum adat sebagai dasar pemidanaan di daerah tertentu.\n4. **Pidana Mati Bersyarat:** Pidana mati bukan lagi hukuman pokok, melainkan diiringi masa percobaan 10 tahun.",
            created_at: Date.now() / 1000 - 3590
          },
          {
            id: "msg-3",
            role: "user",
            content: "Menarik. Terkait pasal kohabitasi yang sempat ramai, bagaimana sebenarnya pengaturannya?",
            created_at: Date.now() / 1000 - 3500
          },
          {
            id: "msg-4",
            role: "assistant",
            content: "Pasal kohabitasi (hidup bersama di luar perkawinan) diatur dalam **Pasal 412 KUHP Baru**. Namun, pasal ini merupakan **delik aduan absolut**.\n\nArtinya, penuntutan hanya bisa dilakukan jika ada aduan langsung dari pihak yang dirugikan, yaitu suami/istri (bagi yang sudah terikat perkawinan), atau orang tua/anaknya. Masyarakat umum, kepala desa, maupun Satpol PP tidak berhak melakukan penggerebekan tanpa adanya aduan resmi dari keluarga inti tersebut.",
            created_at: Date.now() / 1000 - 3490
          }
        ]
      };
    }
    
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