import { messagingApi } from "@line/bot-sdk";

type QuickReply = messagingApi.QuickReply;

export function buildQuickReply(suggestions: string[]): QuickReply | undefined {
  if (suggestions.length === 0) return undefined;

  return {
    items: suggestions.map((text) => ({
      type: "action",
      action: {
        type: "message",
        label: text.length > 20 ? text.slice(0, 17) + "..." : text,
        text,
      },
    })),
  };
}
