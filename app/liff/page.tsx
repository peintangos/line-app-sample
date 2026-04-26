"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState, FormEvent } from "react";
import { LiffProvider, useLiff } from "./components/liff-provider";
import { ProfileHeader } from "./components/profile-header";
import { ChatMessages } from "./components/chat-messages";
import { ChatInput } from "./components/chat-input";

function ChatApp() {
  const { idToken, isLoggedIn, error: liffError, debugInfo } = useLiff();

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: "/api/liff/chat",
      headers: idToken ? { Authorization: `Bearer ${idToken}` } : undefined,
    });
  }, [idToken]);

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status === "streaming" || status === "submitted";

  if (liffError) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-50 p-4">
        <p className="text-center text-red-500">{liffError}</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-gray-50 p-4">
        <p className="text-gray-400">ログイン中...</p>
        <p className="text-xs text-gray-300 break-all max-w-sm text-center">{debugInfo}</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col bg-gray-100">
      <ProfileHeader />

      {error && (
        <div className="bg-red-50 px-4 py-2 text-sm text-red-600">
          エラーが発生しました: {error.message}
        </div>
      )}

      <ChatMessages messages={messages} isLoading={isLoading} />

      <ChatInputWrapper sendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}

function ChatInputWrapper({
  sendMessage,
  isLoading,
}: {
  sendMessage: (msg: { text: string }) => void;
  isLoading: boolean;
}) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <ChatInput
      input={input}
      onInputChange={setInput}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}

export default function LiffPage() {
  return (
    <LiffProvider>
      <ChatApp />
    </LiffProvider>
  );
}
