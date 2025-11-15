import { useEffect, useRef } from "react";

interface Message {
  userid: string;
  username: string;
  message: string;
}

interface MessagesProps {
  messages: Message[];
  currentUserId?: string;
}

export function Messages({ messages, currentUserId }: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "80px",
        right: "7px",
        left: "auto",
        width: "350px",
        height: "550px",
        backgroundColor: "rgba(24, 24, 28, 0.95)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9998,
      }}
    >
      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
              marginTop: "auto",
              marginBottom: "auto",
              fontSize: "14px",
            }}
          >
            No messages yet
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.userid === currentUserId ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  backgroundColor:
                    msg.userid === currentUserId
                      ? "rgba(59, 130, 246, 0.9)"
                      : "rgba(55, 65, 81, 0.8)",
                  color: "white",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  borderBottomLeftRadius:
                    msg.userid === currentUserId ? "12px" : "4px",
                  borderBottomRightRadius:
                    msg.userid === currentUserId ? "4px" : "12px",
                  wordWrap: "break-word",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                {msg.userid !== currentUserId && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      marginBottom: "4px",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    {msg.username}
                  </div>
                )}
                <div>{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scrollbar styling */}
      <style>{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
