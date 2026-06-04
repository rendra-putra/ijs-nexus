import { useEffect, useRef, useState } from "react";
import ChatHistorySidebar from "../components/askAi/ChatHistorySidebar";
import ChatWindow from "../components/askAi/ChatWindow";
import { useThemeContext } from "../contexts/ThemeContext";
import { useChatStore } from "../hooks/useChatStore";
import "../styles/ask-ai.css";

export default function AskAIPage() {
  const { isDark } = useThemeContext();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 768);

  const hasInitialized = useRef(false);

  const {
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
  } = useChatStore();

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // If there is no active chat restored from localStorage
      if (!activeChatId) {
        // Find if there is an empty pristine chat in history
        const emptyChat = chats.find(c => c.title === "Chat Baru");
        if (emptyChat) {
          setActiveChat(emptyChat.id);
        } else if (chats.length > 0) {
          // Select the most recent chat
          setActiveChat(chats[0].id);
        } else {
          // Only create a new chat if history is completely empty
          createChat("Chat Baru");
        }
      }
    }
  }, [activeChatId, chats, createChat, setActiveChat]);

  const handleSelectChat = (id) => {
    setActiveChat(id);
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  const handleCreateChat = async (customTitle) => {
    await createChat(customTitle);
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <div
      className="askai-root"
      data-theme={isDark ? "dark" : "light"}
    >
      <div 
        className={`askai-mobile-overlay ${!sidebarCollapsed ? "active" : ""}`}
        onClick={() => setSidebarCollapsed(true)}
      />

      <ChatHistorySidebar
        chats={chats}
        activeChatId={activeChatId}
        collapsed={sidebarCollapsed}
        onSelectChat={handleSelectChat}
        onCreateChat={handleCreateChat}
        onDeleteChat={deleteChat}
        onRenameChat={renameChat}
        onPinChat={pinChat}
      />

      <ChatWindow
        activeChat={activeChat}
        isAiTyping={isAiTyping}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
        onSendMessage={sendMessage}
      />
    </div>
  );
}