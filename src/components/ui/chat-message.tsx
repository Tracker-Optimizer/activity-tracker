"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/utils/index";

const chatBubbleVariants = cva(
  "group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]",
  {
    variants: {
      isUser: {
        true: "bg-secondary text-secondary-foreground",
        false: "bg-muted text-foreground",
      },
      animation: {
        none: "",
        slide: "duration-300 animate-in fade-in-0",
        scale: "duration-300 animate-in fade-in-0 zoom-in-75",
        fade: "duration-500 animate-in fade-in-0",
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: "slide",
        class: "slide-in-from-right",
      },
      {
        isUser: false,
        animation: "slide",
        class: "slide-in-from-left",
      },
      {
        isUser: true,
        animation: "scale",
        class: "origin-bottom-right",
      },
      {
        isUser: false,
        animation: "scale",
        class: "origin-bottom-left",
      },
    ],
  },
);

type Animation = VariantProps<typeof chatBubbleVariants>["animation"];

export interface MessagePart {
  type?: string;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | (string & {});
  content?: string;
  createdAt?: Date;
  parts?: MessagePart[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = "scale",
  parts,
}) => {
  const isUser = role === "user";

  const textFromParts = Array.isArray(parts)
    ? parts
        .filter((part): part is MessagePart & { text: string } =>
          isTextPart(part),
        )
        .map((part) => part.text)
        .join("\n")
    : "";

  const fallbackContent = content ?? textFromParts;

  const normalizedParts: MessagePart[] =
    Array.isArray(parts) && parts.length > 0
      ? parts
      : fallbackContent
        ? [{ type: "text", text: fallbackContent }]
        : [];

  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      {normalizedParts.length > 0 ? (
        normalizedParts.map((part, index) => {
          if (isTextPart(part)) {
            return (
              <div
                key={`text-${index}`}
                className={cn(chatBubbleVariants({ isUser, animation }))}
              >
                <MarkdownRenderer>{part.text}</MarkdownRenderer>
              </div>
            );
          }

          if (isToolPart(part)) {
            return (
              <div
                key={`tool-${index}`}
                className={cn(
                  chatBubbleVariants({ isUser: false, animation: "none" }),
                  "w-full max-w-md space-y-2",
                )}
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tool Result · {formatToolName(part.type)}
                </div>
                {part.state ? (
                  <div className="text-[11px] text-muted-foreground">
                    State: {String(part.state)}
                  </div>
                ) : null}
                {typeof part.output !== "undefined" ? (
                  <pre className="max-h-64 overflow-auto rounded bg-background/70 p-2 text-xs">
                    {safeStringify(part.output)}
                  </pre>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Awaiting output…
                  </p>
                )}
              </div>
            );
          }

          return null;
        })
      ) : (
        <div className={cn(chatBubbleVariants({ isUser, animation }))}>
          <MarkdownRenderer>{fallbackContent || ""}</MarkdownRenderer>
        </div>
      )}

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            "mt-1 block px-1 text-xs opacity-50",
            animation !== "none" && "duration-500 animate-in fade-in-0",
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

function isTextPart(part: MessagePart): part is MessagePart & { text: string } {
  return (
    part?.type === "text" &&
    typeof (part as { text?: unknown }).text === "string"
  );
}

function isToolPart(part: MessagePart): part is MessagePart & { type: string } {
  return typeof part?.type === "string" && part.type.startsWith("tool-");
}

function formatToolName(type?: string) {
  if (!type) return "unknown";
  return type.replace(/^tool-/i, "");
}

function safeStringify(value: unknown) {
  try {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}
