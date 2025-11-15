import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";

interface ChatMessage {
  userid: string;
  username: string;
  message: string;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onSendMessage: (message: string) => void;
}

export function ChatContainer({
  messages,
  currentUserId,
  onSendMessage,
}: ChatContainerProps) {
  return (
    <>
      <style>{`
        .tldraw-menu-zone {
          display: none !important;
        }
        .tldraw-bottom-panel {
          display: none !important;
        }
      `}</style>

      <Messages messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={onSendMessage} />
    </>
  );
}
