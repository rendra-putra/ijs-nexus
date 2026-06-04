import { CopyOutlined, RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { useMemo } from "react";

export default function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  const htmlContent = useMemo(() => {
    if (isUser) return null;

    // Aggressively remove excessive newlines and empty spaces
    const rawContent = (msg.content || "")
      .replace(/<br\s*\/?>/gi, '\n') // Strip literal HTML breaks
      .replace(/\n{3,}/g, '\n\n'); // Maximum 2 newlines (prevents 3+ empty lines)

    // Using breaks: false prevents single \n from becoming <br>, 
    // forcing text into tight paragraphs.
    const raw = marked.parse(rawContent, { breaks: false });
    
    return DOMPurify.sanitize(raw);
  }, [msg.content, isUser]);

  const timeStr = useMemo(() => {
    const d = new Date(msg.timestamp);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [msg.timestamp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    message.success("Disalin ke clipboard");
  };

  return (
    <div className={`askai-msg ${msg.role}`}>
      {/* Avatar */}
      <div className="askai-msg-avatar">
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div>

      {/* Bubble */}
      <div className="askai-msg-bubble-wrapper">
        {isUser ? (
          <div className="askai-msg-bubble">{msg.content}</div>
        ) : (
          <div
            className="askai-msg-bubble"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        {!isUser && (
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={handleCopy}
            className="askai-msg-copy-btn"
          />
        )}

        <div className="askai-msg-time">{timeStr}</div>
      </div>
    </div>
  );
}
