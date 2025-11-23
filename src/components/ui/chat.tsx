"use client";

import type { UIMessage } from "@ai-sdk/react";
import type { UIDataTypes, UITools } from "ai";
import { ArrowDown, Sparkles } from "lucide-react";
import { forwardRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  type Message as ChatMessage,
  type MessagePart,
} from "@/components/ui/chat-message";
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { cn } from "@/lib/utils/index";

type AIMessage = UIMessage<unknown, UIDataTypes, UITools>;
interface ChatProps {
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  messages: AIMessage[];
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  model?: string;
  onModelChange?: (value: string) => void;
}

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  isGenerating,
  className,
  model,
  onModelChange,
}: ChatProps) {
  const normalizedMessages: ChatMessage[] = messages.map((message, index) => {
    const hasParts =
      typeof (message as { parts?: unknown }).parts !== "undefined" &&
      Array.isArray((message as { parts?: unknown[] }).parts);

    const rawParts: MessagePart[] = hasParts
      ? ((message as { parts?: MessagePart[] }).parts ?? [])
      : [];

    const partsText = rawParts
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part?.text ?? "")
      .join("\n");

    const rawContent = (message as { content?: string }).content;
    const content =
      typeof rawContent === "string" && rawContent.length > 0
        ? rawContent
        : partsText;

    const rawCreatedAt = (message as { createdAt?: Date | string }).createdAt;
    const createdAt =
      rawCreatedAt instanceof Date
        ? rawCreatedAt
        : rawCreatedAt
          ? new Date(rawCreatedAt)
          : undefined;

    return {
      id: message.id ?? String(index),
      role: message.role as ChatMessage["role"],
      content,
      createdAt,
      parts: rawParts.length > 0 ? rawParts : undefined,
    } satisfies ChatMessage;
  });

  const lastMessage = normalizedMessages.at(-1);
  const isTyping = lastMessage?.role === "user";

  return (
    <ChatContainer className={className}>
      {normalizedMessages.length > 0 ? (
        <ChatMessages messages={normalizedMessages}>
          <MessageList messages={normalizedMessages} isTyping={isTyping} />
        </ChatMessages>
      ) : null}

      <ChatForm
        className="mt-auto"
        isPending={isGenerating || isTyping}
        handleSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 relative">
          <MessageInput
            value={input}
            onChange={handleInputChange}
            isGenerating={isGenerating}
            className={model ? "pr-54" : ""}
            actions={
              model &&
              onModelChange && (
                <Select value={model} onValueChange={onModelChange}>
                  <SelectTrigger className="h-8 w-fit gap-2 border-none bg-muted/50 px-2 text-xs shadow-none hover:bg-muted/80 focus:ring-0">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gemini-2.5-flash">
                      Gemini 2.5 Flash
                    </SelectItem>
                  </SelectContent>
                </Select>
              )
            }
          />
        </div>
      </ChatForm>
    </ChatContainer>
  );
}
Chat.displayName = "Chat";

export function ChatMessages({
  messages,
  children,
}: React.PropsWithChildren<{
  messages: ChatMessage[];
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className="grid grid-cols-1 overflow-y-auto pb-4"
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">
        {children}
      </div>

      {!shouldAutoScroll && (
        <div className="pointer-events-none flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="pointer-events-auto h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid max-h-full w-full grid-rows-[1fr_auto]", className)}
      {...props}
    />
  );
});
ChatContainer.displayName = "ChatContainer";

interface ChatFormProps {
  className?: string;
  isPending: boolean;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  children: ReactNode;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, isPending, className }, ref) => {
    const onSubmit = (event: React.FormEvent) => {
      handleSubmit(event);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children}
      </form>
    );
  },
);
ChatForm.displayName = "ChatForm";
