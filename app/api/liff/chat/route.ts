import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { verifyIdToken } from "@/lib/line/verify-id-token";
import { getHistory, appendMessage } from "@/lib/storage/memory";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `あなたはLINE上で動作するAIアシスタントです。
ユーザーの質問に対して、簡潔で分かりやすい日本語で回答してください。
Markdownの書式（見出し、リスト、コードブロック、テーブルなど）を積極的に使って構造化された回答をしてください。`;

function extractTextFromUIMessage(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  let userId = "anonymous";

  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.slice(7);
    const verified = await verifyIdToken(idToken);
    if (verified) {
      userId = userId;
    }
  }

  const { messages } = (await request.json()) as { messages: UIMessage[] };

  const history = getHistory(userId);
  const historyAsUIMessages: UIMessage[] = history.map((m, i) => ({
    id: `history-${i}`,
    role: m.role as "user" | "assistant",
    parts: [{ type: "text" as const, text: m.content }],
    createdAt: new Date(),
  }));

  const allMessages = [...historyAsUIMessages, ...messages];
  const modelMessages = await convertToModelMessages(allMessages);

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    async onFinish({ text }) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg && lastUserMsg.role === "user") {
        const userText = extractTextFromUIMessage(lastUserMsg);
        if (userText) {
          appendMessage(userId, "user", userText);
        }
      }
      appendMessage(userId, "assistant", text);
    },
  });

  return result.toUIMessageStreamResponse();
}
