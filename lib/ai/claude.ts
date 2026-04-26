import Anthropic from "@anthropic-ai/sdk";
import { getHistory } from "../storage/memory";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `あなたはLINE上で動作するAIアシスタントです。
ユーザーの質問に対して、簡潔で分かりやすい日本語で回答してください。
Markdownの書式（見出し、リスト、コードブロック、テーブルなど）を使って構造化された回答をしてください。
回答の最後に、ユーザーが次に聞きそうな質問を3つ提案してください。提案は以下の形式で書いてください:

---suggestions---
1. 質問1
2. 質問2
3. 質問3`;

export async function generateResponse(
  userId: string,
  userMessage: string
): Promise<string> {
  const history = getHistory(userId);

  const messages = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return text;
}
