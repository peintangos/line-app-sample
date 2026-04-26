"use client";

import { FormEvent, useRef } from "react";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 border-t bg-white px-4 py-3"
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="メッセージを入力..."
        disabled={isLoading}
        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        送信
      </button>
    </form>
  );
}
