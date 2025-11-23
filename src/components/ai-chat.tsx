"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { useState } from "react";
import { Chat as ChatUI } from "@/components/ui/chat";

export default function Chat() {
  const [model, setModel] = useState("gemini-2.5-flash");

  const { messages, sendMessage, status } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.();
    if (!input.trim()) return;
    sendMessage({ text: input }, { body: { model } });
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex flex-col h-full overflow-hidden my-4">
      <ChatUI
        className="h-full"
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isLoading}
        model={model}
        onModelChange={setModel}
      />
    </div>
  );
}
