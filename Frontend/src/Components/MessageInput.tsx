import { useState } from "react";
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function MessageInput({
  onSendMessage,
  isLoading = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: "7px",
        right: "7px",
        left: "auto",
        width: "350px",
        zIndex: 9998,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          backgroundColor: "rgba(24, 24, 28, 0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "12px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: "rgba(55, 65, 81, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "10px 12px",
            color: "white",
            fontSize: "14px",
            outline: "none",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.9)";
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(55, 65, 81, 0.6)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          style={{
            backgroundColor:
              message.trim() && !isLoading
                ? "rgba(59, 130, 246, 0.9)"
                : "rgba(107, 114, 128, 0.4)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 12px",
            cursor: message.trim() && !isLoading ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            opacity: message.trim() && !isLoading ? 1 : 0.6,
          }}
          onMouseEnter={(e) => {
            if (message.trim() && !isLoading) {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "rgba(59, 130, 246, 1)";
            }
          }}
          onMouseLeave={(e) => {
            if (message.trim() && !isLoading) {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "rgba(59, 130, 246, 0.9)";
            }
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
