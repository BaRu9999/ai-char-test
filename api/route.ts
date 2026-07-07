import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { AiDiagnosisResult, LocalResult, TeaType, getFallbackResult } from "@/lib/diagnosisData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  answers: Array<{
    question: string;
    answer: string;
    scores: Record<string, number>;
  }>;
  ranking: Array<{
    type: TeaType;
    point: number;
    name: string;
  }>;
  bestType: TeaType;
  matchRate: number;
  baseResult: LocalResult;
};

function normalizeResult(input: Partial<AiDiagnosisResult>, fallback: AiDiagnosisResult): AiDiagnosisResult {
  return {
    name: typeof input.name === "string" && input.name.trim() ? input.name : fallback.name,
    matchRate: typeof input.matchRate === "number" ? Math.min(99, Math.max(70, Math.round(input.matchRate))) : fallback.matchRate,
    personality: typeof input.personality === "string" && input.personality.trim() ? input.personality : fallback.personality,
    condition: typeof input.condition === "string" && input.condition.trim() ? input.condition : fallback.condition,
    cross: Array.isArray(input.cross) && input.cross.length > 0 ? input.cross.slice(0, 3).map((item, index) => ({
      rank: typeof item.rank === "string" && item.rank.trim() ? item.rank : fallback.cross[index]?.rank || "おすすめ",
      title: typeof item.title === "string" && item.title.trim() ? item.title : fallback.cross[index]?.title || fallback.cross[0].title,
      description: typeof item.description === "string" && item.description.trim() ? item.description : fallback.cross[index]?.description || fallback.cross[0].description,
      stars: typeof item.stars === "string" && item.stars.trim() ? item.stars : fallback.cross[index]?.stars || "★★★★☆"
    })) : fallback.cross,
    meters: input.meters && typeof input.meters === "object" ? {
      香り: Math.min(100, Math.max(0, Number(input.meters.香り ?? fallback.meters.香り ?? 80))),
      甘さ: Math.min(100, Math.max(0, Number(input.meters.甘さ ?? fallback.meters.甘さ ?? 70))),
      満足度: Math.min(100, Math.max(0, Number(input.meters.満足度 ?? fallback.meters.満足度 ?? 85)))
    } : fallback.meters,
    kotoba: typeof input.kotoba === "string" && input.kotoba.trim() ? input.kotoba : fallback.kotoba
  };
}

function parseJson(text: string): Partial<AiDiagnosisResult> {
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned) as Partial<AiDiagnosisResult>;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI response did not contain JSON.");
    }
    return JSON.parse(match[0]) as Partial<AiDiagnosisResult>;
  }
}

export async function POST(request: NextRequest) {
  let body: RequestBody | null = null;

  try {
    body = (await request.json()) as RequestBody;

    if (!body || !body.bestType || !body.baseResult || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "診断データが不足しています。" }, { status: 400 });
    }

    const fallback = getFallbackResult(body.bestType, body.matchRate || 90);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ result: fallback, usedFallback: true });
    }

    const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
あなたは和カフェ「祇園茶寮 × タニタカフェ」の店頭診断ツールに入るAIです。
お客様の回答をもとに、和茶タイプの性格診断結果を作ってください。

重要ルール：
- ベース診断タイプは変えないでください。
- おすすめ商品名は、ベース結果にある商品名を優先して使ってください。
- 店頭で読む文章なので、長すぎず、やさしく、上品で、少し楽しい雰囲気にしてください。
- 「スタッフにお伝えください」は絶対に入れないでください。
- 診断結果は自然なクロスセルにつながる内容にしてください。
- 必ず日本語で返してください。
- 必ずJSONのみを返してください。Markdownや説明文は不要です。

返すJSON形式：
{
  "name": "🍵 抹茶タイプ のような診断名",
  "matchRate": 95,
  "personality": "AIから見たあなたの性格。80〜130字程度。",
  "condition": "今日のあなたの状態。70〜120字程度。",
  "cross": [
    { "rank": "🥇 一番おすすめ", "title": "商品名 ＋ 商品名", "description": "おすすめ理由", "stars": "★★★★★" },
    { "rank": "🥈 甘味を楽しむなら", "title": "商品名 ＋ 商品名", "description": "おすすめ理由", "stars": "★★★★☆" },
    { "rank": "🥉 軽く楽しむなら", "title": "商品名", "description": "おすすめ理由", "stars": "★★★★☆" }
  ],
  "meters": { "香り": 90, "甘さ": 70, "満足度": 95 },
  "kotoba": "一期一会"
}

お客様の回答：
${JSON.stringify(body.answers, null, 2)}

相性ランキング：
${JSON.stringify(body.ranking, null, 2)}

ベース診断タイプ：
${body.bestType}

ベース結果：
${JSON.stringify(body.baseResult, null, 2)}

相性率：
${body.matchRate}%
`;

    const response = await client.responses.create({
      model,
      instructions: "あなたは飲食店の販促と和カフェ向けコピーライティングに強い日本語AIです。出力は必ず有効なJSONだけにしてください。",
      input: prompt,
      max_output_tokens: 1200
    });

    const outputText = response.output_text;

    if (!outputText) {
      return NextResponse.json({ result: fallback, usedFallback: true });
    }

    const parsed = parseJson(outputText);
    const result = normalizeResult(parsed, fallback);

    return NextResponse.json({ result, usedFallback: false });
  } catch (error) {
    console.error("diagnose api error:", error);

    if (body?.bestType) {
      return NextResponse.json({
        result: getFallbackResult(body.bestType, body.matchRate || 90),
        usedFallback: true
      });
    }

    return NextResponse.json({ error: "診断中にエラーが発生しました。" }, { status: 500 });
  }
}
