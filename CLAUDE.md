# LINE AI Agent Sample

LINE をインターフェースにした AI エージェントの検証プロジェクト。
Messaging API と LIFF の2レイヤーで「何ができて何ができないか」を検証する。

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS
- @line/bot-sdk — Messaging API
- @line/liff — LIFF SDK（クライアント側のみ、dynamic import必須）
- @anthropic-ai/sdk — Claude API（非ストリーミング、Webhook用）
- ai + @ai-sdk/react — Vercel AI SDK（SSEストリーミング、LIFF用）
- markdown-flex-message — Markdown→Flex Message変換
- react-markdown + remark-gfm + rehype-highlight — LIFF Markdown表示

## 実装上の注意

- Webhook の署名検証: `req.text()` → HMAC-SHA256 検証 → `JSON.parse()`。`req.json()` を先に呼ぶと壊れる
- LIFF SDK は `useEffect` 内で dynamic import する。トップレベル import は SSR エラーになる
- ローディングアニメーションは1対1チャットのみ対応
- 会話履歴はインメモリ Map（検証用途、永続化なし）

## コマンド

- `npm run dev` — 開発サーバー起動
- `npm run build` — ビルド
- `npm run lint` — ESLint
