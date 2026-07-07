"use client";

import { useMemo, useState } from "react";
import {
  AiDiagnosisResult,
  Option,
  ScoreMap,
  TeaType,
  getFallbackResult,
  localResults,
  questions
} from "@/lib/diagnosisData";

type AnswerLog = {
  question: string;
  answer: string;
  scores: ScoreMap;
};

type RankingItem = {
  type: TeaType;
  point: number;
};

const typeOrder: TeaType[] = ["matcha", "hojicha", "wakoucha", "kuwa", "biwa", "rooibos"];

function calculateRanking(score: Record<string, number>): RankingItem[] {
  return typeOrder
    .map((type) => ({ type, point: score[type] || 0 }))
    .sort((a, b) => b.point - a.point);
}

function calculateMatchRate(point: number): number {
  return Math.min(99, 86 + point);
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState<Record<string, number>>({});
  const [answerLogs, setAnswerLogs] = useState<AnswerLog[]>([]);
  const [screen, setScreen] = useState<"start" | "quiz" | "loading" | "result">("start");
  const [result, setResult] = useState<AiDiagnosisResult | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const progressWidth = useMemo(() => {
    return `${(current / questions.length) * 100}%`;
  }, [current]);

  const startQuiz = () => {
    setCurrent(0);
    setScore({});
    setAnswerLogs([]);
    setResult(null);
    setRanking([]);
    setErrorMessage("");
    setScreen("quiz");
  };

  const restartQuiz = () => {
    setCurrent(0);
    setScore({});
    setAnswerLogs([]);
    setResult(null);
    setRanking([]);
    setErrorMessage("");
    setScreen("start");
  };

  const selectOption = async (option: Option) => {
    if (screen !== "quiz") return;

    const nextScore = { ...score };

    Object.entries(option.scores).forEach(([type, point]) => {
      nextScore[type] = (nextScore[type] || 0) + (point || 0);
    });

    const nextAnswerLogs = [
      ...answerLogs,
      {
        question: questions[current].q,
        answer: option.text,
        scores: option.scores
      }
    ];

    setScore(nextScore);
    setAnswerLogs(nextAnswerLogs);

    const nextCurrent = current + 1;

    if (nextCurrent < questions.length) {
      setCurrent(nextCurrent);
      return;
    }

    await showAiResult(nextScore, nextAnswerLogs);
  };

  const showAiResult = async (
    finalScore: Record<string, number>,
    finalAnswers: AnswerLog[]
  ) => {
    setScreen("loading");
    setErrorMessage("");

    const finalRanking = calculateRanking(finalScore);
    const best = finalRanking[0];
    const baseResult = localResults[best.type];
    const matchRate = calculateMatchRate(best.point);

    setRanking(finalRanking);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: finalAnswers,
          ranking: finalRanking.map((item) => ({
            type: item.type,
            point: item.point,
            name: localResults[item.type].name
          })),
          bestType: best.type,
          matchRate,
          baseResult
        })
      });

      if (!response.ok) {
        throw new Error("AI診断APIでエラーが発生しました。 ");
      }

      const data = (await response.json()) as { result?: AiDiagnosisResult };

      if (!data.result) {
        throw new Error("診断結果が空です。 ");
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult(getFallbackResult(best.type, matchRate));
      setErrorMessage("AI診断に接続できなかったため、通常診断の結果を表示しています。環境変数 OPENAI_API_KEY を確認してください。");
    } finally {
      setScreen("result");
    }
  };

  const currentQuestion = questions[current];

  return (
    <main className="wrap">
      <section className="card">
        <header className="header">
          <div className="brand">祇園茶寮 × タニタカフェ</div>
          <div className="title">あなたを和茶に<br />たとえると？</div>
        </header>

        <div className="content">
          {screen === "start" && (
            <div>
              <div className="lead">あなたの今の気分を、<br />一杯のお茶にたとえると？</div>
              <div className="text">
                7つの質問から、あなたにぴったりの和茶タイプをAIが診断。<br />
                結果に合わせて、今日おすすめの組み合わせもご提案します。
              </div>
              <button className="btn" type="button" onClick={startQuiz}>診断をはじめる</button>
            </div>
          )}

          {screen === "quiz" && currentQuestion && (
            <div>
              <div className="progress"><div className="bar" style={{ width: progressWidth }} /></div>
              <div className="qno">Q{current + 1} / {questions.length}</div>
              <div className="question">{currentQuestion.q}</div>
              <div>
                {currentQuestion.options.map((option) => (
                  <button
                    className="option"
                    type="button"
                    key={option.text}
                    onClick={() => selectOption(option)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {screen === "loading" && (
            <div className="loadingBox">
              <div className="loadingTitle">AIが診断中...</div>
              <div className="text">
                回答内容をもとに、あなたに合う和茶タイプとおすすめセットを作成しています。
              </div>
              <div className="loadingDots"><span></span><span></span><span></span></div>
            </div>
          )}

          {screen === "result" && result && (
            <div>
              <div className="resultName">{result.name}</div>
              <div className="matchRate">あなたとの相性 {result.matchRate}%</div>

              {errorMessage && <div className="notice">{errorMessage}</div>}

              <div className="box">
                <div className="label">AIから見たあなた</div>
                <div className="desc">{result.personality}</div>
              </div>

              <div className="box">
                <div className="label">今日のあなた</div>
                <div className="desc">{result.condition}</div>
              </div>

              <div className="box">
                <div className="label">AIおすすめセット</div>
                <div>
                  {result.cross.map((item) => (
                    <div className="crossItem" key={`${item.rank}-${item.title}`}>
                      <div className="crossRank">{item.rank}</div>
                      <div className="crossTitle">{item.title}</div>
                      <div className="desc">{item.description}</div>
                      <div className="stars">{item.stars}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="box">
                <div className="label">おすすめ度</div>
                <div>
                  {Object.entries(result.meters).map(([key, value]) => (
                    <div className="meterRow" key={key}>
                      <div className="meterLabel">{key}　{value}%</div>
                      <div className="meter"><span style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="box">
                <div className="label">相性の良いお茶ランキング</div>
                <div className="ranking">
                  {ranking.slice(0, 3).map((item, index) => (
                    <div key={item.type}>{index + 1}位：{localResults[item.type].name}</div>
                  ))}
                </div>
              </div>

              <div className="box">
                <div className="label">今日の和ことば</div>
                <div className="kotoba">{result.kotoba}</div>
              </div>

              <button className="btn" type="button" onClick={restartQuiz}>もう一度診断する</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
