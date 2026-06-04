import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";

import { 
  getChatHistoryRequest, 
  createSessionRequest, 
  sendCompletionRequest 
} from "../services/aiService";

const ACTIVE_KEY = "askAi_activeChat";
const SESSIONS_KEY = "askAi_sessions";

function loadSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (parsed.length === 0) {
      return [{
        id: 'demo-kuhp',
        title: 'Q&A: KUHP Baru (UU 1/2023)',
        userId: 'demo',
        updatedAt: new Date().toISOString(),
      }];
    }
    return parsed;
  } catch (e) {
    return [{
      id: 'demo-kuhp',
      title: 'Q&A: KUHP Baru (UU 1/2023)',
      userId: 'demo',
      updatedAt: new Date().toISOString(),
    }];
  }
}

export function useChatStore() {
  const { user } = useAuth();
  const currentUserId = user?.id; 

  const [activeChatId, setActiveChatIdState] = useState(() => {
    const saved = localStorage.getItem(ACTIVE_KEY);
    const storedSessions = loadSessions();
    if (saved && storedSessions.some(s => s.id === saved)) {
      return saved;
    }
    return null;
  });
  const [sessions, setSessions] = useState(loadSessions); 
  const [localMessages, setLocalMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [pinnedIds, setPinnedIds] = useState([]);
  const [renamedTitles, setRenamedTitles] = useState({});

  useEffect(() => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const fetchHistory = async (sessionId) => {
    try {
      const responseData = await getChatHistoryRequest(sessionId);
      const historyArray = responseData.messages || [];

      const mappedMessages = historyArray.map((msg, index) => ({
        id: `msg-${msg.message_id || msg.id || 'history'}-${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at 
                  ? new Date(msg.created_at * 1000).toISOString()
                  : new Date().toISOString(),
      }));
      setLocalMessages(mappedMessages);
    } catch (error) {
      console.error("Error fetching history:", error);
      setLocalMessages([]); 
    }
  };

  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(ACTIVE_KEY, activeChatId);
      setLocalMessages([]);
      fetchHistory(activeChatId);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
      setLocalMessages([]);
    }
  }, [activeChatId]);

  const chats = useMemo(() => {
    const mappedChats = sessions.map((session) => ({
      id: session.id,
      title: renamedTitles[session.id] || session.title,
      pinned: pinnedIds.includes(session.id),
      updatedAt: session.updatedAt,
      messages: session.id === activeChatId ? localMessages : [],
    }));

    return mappedChats.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [sessions, activeChatId, localMessages, pinnedIds, renamedTitles]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const setActiveChat = useCallback((id) => {
    setActiveChatIdState(id);
  }, []);

  const createChat = useCallback(async (customTitle = "Chat Baru") => {
    try {
      const responseData = await createSessionRequest();
      const newId = responseData.data.id;

      const newSession = {
        id: newId,
        title: customTitle,
        userId: currentUserId,
        updatedAt: new Date().toISOString(),
      };

      setSessions((prev) => [newSession, ...prev]);
      setActiveChatIdState(newId);
      
      return newId;
    } catch (error) {
      console.error("Failed creating new session:", error);
    }
  }, [currentUserId]);

  const deleteChat = useCallback((id) => {
    setSessions((prev) => prev.filter(s => s.id !== id));
    if (activeChatId === id) {
      setActiveChatIdState(null);
    }
  }, [activeChatId]);

  const renameChat = useCallback((id, newTitle) => {
    setRenamedTitles((prev) => ({ ...prev, [id]: newTitle }));
  }, []);

  const pinChat = useCallback((id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    let targetSessionId = activeChatId;

    const words = text.trim().split(/\s+/);
    const smartTitle = words.slice(0, 4).join(" ").replace(/[?!.]/g, ''); 
    const finalTitle = smartTitle.charAt(0).toUpperCase() + smartTitle.slice(1) + (words.length > 4 ? "..." : "");

    if (!targetSessionId) {
      targetSessionId = await createChat(finalTitle);
      if (!targetSessionId) return; 
    } else {
      const isFirstUserMsg = !localMessages.some(m => m.role === "user");
      const currentChat = sessions.find(s => s.id === targetSessionId);

      if (isFirstUserMsg && currentChat && currentChat.title === "Chat Baru") {
        renameChat(targetSessionId, finalTitle);
        
        setSessions((prev) => prev.map(s => 
          s.id === targetSessionId ? { ...s, title: finalTitle, updatedAt: new Date().toISOString() } : s
        ));
      } else {
        setSessions((prev) => prev.map(s => 
          s.id === targetSessionId ? { ...s, updatedAt: new Date().toISOString() } : s
        ));
      }
    }

    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, tempUserMsg]);
    setIsAiTyping(true);

    try {
      const responseData = await sendCompletionRequest(text, targetSessionId, false);

      const aiText = responseData?.data?.data?.content
                    || responseData?.data?.content
                    || responseData?.answer
                    || "Maaf, tidak dapat membaca balasan dari server.";
      
      const newAssistantMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: aiText, 
        timestamp: new Date().toISOString(),
      };

      setLocalMessages((prev) => [...prev, newAssistantMsg]);

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsAiTyping(false);
    }
  }, [activeChatId, localMessages, sessions, createChat, renameChat]);

  return {
    chats,
    activeChat,
    activeChatId,
    isAiTyping,
    createChat,
    deleteChat,
    renameChat,
    pinChat,
    sendMessage,
    setActiveChat,
  };
}