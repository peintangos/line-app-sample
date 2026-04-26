"use client";

import type { UIMessage } from "ai";
import { MarkdownRenderer } from "./markdown-renderer";

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.length === 0 && (
        <div className="flex h-full items-center justify-center text-gray-400">
          <p>メッセージを送信してください</p>
        </div>
      )}

      {messages.map((message) => {
        const text = getMessageText(message);
        if (!text) return null;

        return (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white shadow-sm"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={text} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{text}</p>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
