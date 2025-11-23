import { ChatMessage, type Message } from "@/components/ui/chat-message";
import { TypingIndicator } from "@/components/ui/typing-indicator";

interface MessageListProps {
  messages: Message[];
  showTimeStamps?: boolean;
  isTyping?: boolean;
}

export function MessageList({
  messages,
  showTimeStamps = true,
  isTyping = false,
}: MessageListProps) {
  return (
    <div className="space-y-4 overflow-visible">
      {messages.map((message, index) => {
        return (
          <ChatMessage
            key={index}
            showTimeStamp={showTimeStamps}
            {...message}
          />
        );
      })}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
