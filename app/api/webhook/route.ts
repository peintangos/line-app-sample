import { NextResponse } from "next/server";
import { webhook, messagingApi } from "@line/bot-sdk";
import { lineClient } from "@/lib/line/client";
import { verifySignature } from "@/lib/line/verify-signature";
import { showLoadingAnimation } from "@/lib/line/loading-animation";
import { generateResponse } from "@/lib/ai/claude";
import { appendMessage } from "@/lib/storage/memory";
import { parseSuggestions } from "@/lib/ai/parse-suggestions";
import { markdownToFlex } from "@/lib/line/flex/markdown-to-flex";
import { buildQuickReply } from "@/lib/line/flex/quick-reply";
import { appendLiffButton } from "@/lib/line/flex/liff-button";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const events: webhook.Event[] = body.events;

  await Promise.allSettled(events.map((event) => handleEvent(event)));

  return NextResponse.json({ status: "ok" });
}

async function handleEvent(event: webhook.Event): Promise<void> {
  if (event.type !== "message") return;

  const messageEvent = event as webhook.MessageEvent;
  if (messageEvent.message.type !== "text") return;

  const userId = messageEvent.source?.userId;
  if (!userId) return;

  const userMessage = (messageEvent.message as webhook.TextMessageContent).text;
  const replyToken = messageEvent.replyToken;
  if (!replyToken) return;

  await showLoadingAnimation(userId);

  const rawResponse = await generateResponse(userId, userMessage);
  const { content, suggestions } = parseSuggestions(rawResponse);

  appendMessage(userId, "user", userMessage);
  appendMessage(userId, "assistant", content);

  const quickReply = buildQuickReply(suggestions);

  const flexMessage = await markdownToFlex(content, `AI: ${content.slice(0, 60)}`);

  const message: messagingApi.Message = flexMessage
    ? { ...appendLiffButton(flexMessage), quickReply }
    : { type: "text", text: content, quickReply };

  await lineClient.replyMessage({
    replyToken,
    messages: [message],
  });
}
