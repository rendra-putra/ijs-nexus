import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import PromptSuggestions from "./PromptSuggestions";

const { TextArea } = Input;

export default function ChatWindow({
  activeChat,
  isAiTyping,
  sidebarCollapsed,
  onToggleSidebar,
  onSendMessage,
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = activeChat?.messages || [];
  const userMessagesCount = messages.filter(m => m.role === "user").length;
  
  // A chat is considered pristine if it's titled "Chat Baru" and the user hasn't sent anything yet.
  const isPristineNewChat = activeChat?.title === "Chat Baru" && userMessagesCount === 0;

  // Hide the default backend greeting message if it's a pristine new chat
  const visibleMessages = isPristineNewChat ? [] : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isAiTyping) return;
    onSendMessage(inputValue.trim());
    setInputValue("");

    if (textareaRef.current?.resizableTextArea?.textArea) {
      textareaRef.current.resizableTextArea.textArea.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="askai-main">
      <div className="askai-chat-header">
        <Button
          type="text"
          className="askai-toggle-sidebar-btn"
          icon={
            sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
          }
          onClick={onToggleSidebar}
        />
        <span className="askai-chat-header-title">
          {activeChat?.title || "Ask AI"}
        </span>
      </div>

      <div className="askai-messages">
        {visibleMessages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        
        {isPristineNewChat && (
          <PromptSuggestions 
            onSelect={(prompt) => {
              setInputValue(prompt);
              textareaRef.current?.focus();
            }} 
          />
        )}
        {isAiTyping && (
          <div className="askai-typing">
            <div className="askai-msg-avatar" style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff",
              boxShadow: "0 2px 10px rgba(79, 70, 229, 0.3)",
              flexShrink: 0,
            }}>
              <RobotOutlined />
            </div>
            <div className="askai-typing-dots">
              <div className="askai-typing-dot" />
              <div className="askai-typing-dot" />
              <div className="askai-typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="askai-input-area">
        <div className="askai-input-container">
          <TextArea
            ref={textareaRef}
            className="askai-textarea"
            placeholder="Tulis pertanyaan kamu di sini..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoSize={{ minRows: 1, maxRows: 5 }}
            disabled={isAiTyping}
          />
          <Button
            className="askai-send-btn"
            icon={<SendOutlined />}
            disabled={!inputValue.trim() || isAiTyping}
            onClick={handleSend}
          />
        </div>
        <div className="askai-input-hint">
          (AI bisa salah, mohon periksa kembali jawaban)
        </div>
      </div>
    </div>
  );
}