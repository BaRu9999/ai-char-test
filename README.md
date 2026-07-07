# AI和茶性格診断ツール

祇園茶寮 × タニタカフェ向けの、Vercel / Next.js で動くAI診断ツールです。

## できること

- 7つの質問で和茶タイプを判定
- 判定結果をもとにOpenAI APIで文章を生成
- おすすめセット・おすすめ度・ランキング・今日の和ことばを表示
- APIキーはブラウザ側に出さず、サーバー側の `/api/diagnose` で使用

## ファイル構成

```txt
wacha-ai-diagnosis/
├─ app/
│  ├─ api/
│  │  └─ diagnose/
│  │     └─ route.ts
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ lib/
│  └─ diagnosisData.ts
├─ .env.local.example
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

## ローカルで動かす方法

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` にOpenAI APIキーを入れます。

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-5-mini
```

起動します。

```bash
npm run dev
```

ブラウザで以下を開きます。

```txt
http://localhost:3000
```

## Vercelに公開する方法

1. GitHubにこのフォルダの中身をアップロード
2. VercelでそのGitHubリポジトリをImport
3. Vercelの Project Settings → Environment Variables に以下を追加

```txt
OPENAI_API_KEY=自分のOpenAI APIキー
OPENAI_MODEL=gpt-5-mini
```

4. Deploy

## 注意

- `OPENAI_API_KEY` は絶対に `app/page.tsx` やHTMLの中に書かないでください。
- APIキーは `.env.local` または Vercel の Environment Variables にだけ入れてください。
- API接続に失敗した場合も、通常診断の結果を表示するようにしてあります。
