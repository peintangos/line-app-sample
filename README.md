# LINE AI Agent Sample

LINE をインターフェースにした AI エージェントの検証プロジェクトです。
Messaging API / LIFF / LINE Bot MCP Server の3つのレイヤーで「何ができて何ができないか」を実装して検証しました。

## 検証結果

| 機能 | Messaging API | LIFF | MCP Server |
|---|:---:|:---:|:---:|
| テキスト送信 / 応答 | ○ | ○ | ○（送信） |
| リッチカード UI（Flex Message） | ○ | – | ○（送信） |
| フォローアップ提案（Quick Reply） | ○ | – | – |
| ローディングアニメーション | ○ | – | – |
| ストリーミング表示 | ✗ | ○ | – |
| Markdown レンダリング | ✗ | ○ | – |

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS
- `@line/bot-sdk` — Messaging API
- `@line/liff` — LIFF SDK
- `@anthropic-ai/sdk` — Claude API（非ストリーミング、Webhook 用）
- `ai` + `@ai-sdk/anthropic` — Vercel AI SDK（SSE ストリーミング、LIFF 用）
- `markdown-flex-message` — Markdown → Flex Message 変換
- `react-markdown` + `remark-gfm` + `rehype-highlight` — LIFF Markdown 表示
- Vercel にデプロイ

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に LINE / Anthropic のキーを設定
npm run dev
```

### 環境変数

| 変数名 | 説明 |
|---|---|
| `LINE_CHANNEL_SECRET` | Messaging API チャネルシークレット |
| `LINE_CHANNEL_ACCESS_TOKEN` | Messaging API チャネルアクセストークン |
| `LIFF_ID` | LIFF アプリ ID |
| `NEXT_PUBLIC_LIFF_ID` | LIFF アプリ ID（クライアント用） |
| `ANTHROPIC_API_KEY` | Anthropic API キー |

## 記事

[LINEでAIエージェントはどこまで作れる？Messaging API・LIFF・MCP Serverを実装して検証した](https://zenn.dev/peintangos/articles/b024c86e672191)
