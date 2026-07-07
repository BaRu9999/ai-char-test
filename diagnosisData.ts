export type TeaType = "matcha" | "hojicha" | "wakoucha" | "kuwa" | "biwa" | "rooibos";

export type ScoreMap = Partial<Record<TeaType, number>>;

export type Option = {
  text: string;
  scores: ScoreMap;
};

export type Question = {
  q: string;
  options: Option[];
};

export type CrossSellItem = {
  rank: string;
  title: string;
  description: string;
  stars: string;
};

export type LocalResult = {
  name: string;
  personality: string;
  condition: string;
  cross: CrossSellItem[];
  meters: Record<string, number>;
};

export type AiDiagnosisResult = LocalResult & {
  matchRate: number;
  kotoba: string;
};

export const questions: Question[] = [
  {
    q: "今日の気分に一番近いものは？",
    options: [
      { text: "🍃 落ち着きたい", scores: { matcha: 3, hojicha: 1 } },
      { text: "🌿 スッキリしたい", scores: { biwa: 3, wakoucha: 1 } },
      { text: "🎁 ごほうび気分", scores: { hojicha: 3, wakoucha: 2 } },
      { text: "🌿 体にやさしいものがいい", scores: { kuwa: 3, rooibos: 1 } }
    ]
  },
  {
    q: "今の疲れ具合は？",
    options: [
      { text: "まだまだ元気", scores: { biwa: 3, wakoucha: 1 } },
      { text: "少しひと息つきたい", scores: { hojicha: 3, matcha: 1 } },
      { text: "かなり癒されたい", scores: { kuwa: 2, hojicha: 2 } },
      { text: "気分転換したい", scores: { wakoucha: 3, biwa: 1 } }
    ]
  },
  {
    q: "好きな味わいは？",
    options: [
      { text: "深くて濃い味", scores: { matcha: 3 } },
      { text: "香ばしい味", scores: { hojicha: 3, rooibos: 2 } },
      { text: "すっきり爽やか", scores: { biwa: 3 } },
      { text: "やさしく甘みのある味", scores: { kuwa: 3, wakoucha: 1 } }
    ]
  },
  {
    q: "食事で重視することは？",
    options: [
      { text: "健康バランス", scores: { kuwa: 3, biwa: 1 } },
      { text: "満足感", scores: { rooibos: 3, hojicha: 1 } },
      { text: "見た目や気分", scores: { wakoucha: 3 } },
      { text: "和の落ち着き", scores: { matcha: 3 } }
    ]
  },
  {
    q: "休日の過ごし方は？",
    options: [
      { text: "家でゆっくり", scores: { hojicha: 3 } },
      { text: "自然の中で過ごす", scores: { kuwa: 2, biwa: 2 } },
      { text: "カフェ巡り", scores: { wakoucha: 3 } },
      { text: "美味しいものを食べに行く", scores: { rooibos: 3 } }
    ]
  },
  {
    q: "人からよく言われる印象は？",
    options: [
      { text: "落ち着いている", scores: { matcha: 3 } },
      { text: "やさしい", scores: { hojicha: 3 } },
      { text: "しっかりしている", scores: { biwa: 3 } },
      { text: "話しやすい", scores: { rooibos: 2, wakoucha: 1 } }
    ]
  },
  {
    q: "今日の食後に欲しいものは？",
    options: [
      { text: "抹茶スイーツ", scores: { matcha: 3 } },
      { text: "わらび餅", scores: { hojicha: 2, rooibos: 2 } },
      { text: "香りの良いお茶", scores: { wakoucha: 3 } },
      { text: "さっぱり整う一杯", scores: { biwa: 2, kuwa: 2 } }
    ]
  }
];

export const localResults: Record<TeaType, LocalResult> = {
  matcha: {
    name: "🍵 抹茶タイプ",
    personality: "落ち着きがあり、周りから信頼されるタイプ。丁寧で、自分のペースを大切にできる人です。",
    condition: "今日は少し心を整えたい日。深みのある味わいで、ゆっくり過ごす時間と相性が良さそうです。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "抹茶ラテ ＋ 抹茶テリーヌ", description: "濃厚な抹茶の香りをしっかり楽しめる、満足度の高い組み合わせです。", stars: "★★★★★" },
      { rank: "🥈 甘味を楽しむなら", title: "抹茶ラテ ＋ 二色わらび餅", description: "やさしい甘さで、食後にもおすすめです。", stars: "★★★★☆" },
      { rank: "🥉 軽く楽しむなら", title: "抹茶ラテ", description: "和の余韻をゆっくり楽しめます。", stars: "★★★★☆" }
    ],
    meters: { 香り: 90, 甘さ: 75, 満足度: 95 }
  },
  hojicha: {
    name: "🍂 ほうじ茶タイプ",
    personality: "穏やかでやさしい癒し系。一緒にいる人をほっとさせる、あたたかい魅力があります。",
    condition: "少し疲れが出ているかも。香ばしいお茶と甘味で、今日は自分を甘やかしても良い日です。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "ほうじ茶キャラメルミルクティー ＋ ほうじ茶アイスと黒豆きな粉アイスパフェ", description: "香ばしい香りとやさしい甘さが相性抜群です。", stars: "★★★★★" },
      { rank: "🥈 食後にゆっくり", title: "ほうじ茶キャラメルミルクティー ＋ 抹茶テリーヌ", description: "甘味をしっかり楽しみたい方におすすめです。", stars: "★★★★☆" },
      { rank: "🥉 軽く楽しむなら", title: "ほうじ茶キャラメルミルクティー", description: "ほっと落ち着く一杯です。", stars: "★★★★☆" }
    ],
    meters: { 香り: 95, 甘さ: 80, 満足度: 90 }
  },
  wakoucha: {
    name: "🌱 和紅茶タイプ",
    personality: "感性が豊かで上品なタイプ。新しい発見や、ゆったりした時間を楽しめる人です。",
    condition: "気分転換を求めている状態。香りの良いお茶や、軽めのデザートと相性が良さそうです。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "和紅茶 ＋ 抹茶テリーヌ", description: "香り豊かな和紅茶と濃厚な抹茶の組み合わせです。", stars: "★★★★★" },
      { rank: "🥈 甘味を楽しむなら", title: "和紅茶 ＋ 二色わらび餅", description: "やさしい甘さで、食後のひとときにぴったりです。", stars: "★★★★☆" },
      { rank: "🥉 お食事と合わせるなら", title: "和紅茶 ＋ タニタコラボプレート", description: "体も心も整えたい日におすすめです。", stars: "★★★★☆" }
    ],
    meters: { 香り: 98, 甘さ: 70, 満足度: 88 }
  },
  kuwa: {
    name: "🫘 桑茶タイプ",
    personality: "健康意識が高く、まわりを気遣えるタイプ。無理をしすぎず、整える時間を大切にできる人です。",
    condition: "体にやさしいものを求めている日。ほっとする一杯で、食後を軽やかに整えましょう。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "リフレッシュハーブティー ＋ タニタ御膳", description: "体を整えたい今日におすすめの組み合わせです。", stars: "★★★★★" },
      { rank: "🥈 食後に軽く", title: "リフレッシュハーブティー ＋ 二色わらび餅", description: "やさしい甘さで、重すぎず楽しめます。", stars: "★★★★☆" },
      { rank: "🥉 さっぱり楽しむなら", title: "リフレッシュハーブティー", description: "ノンカフェインで食後にも飲みやすい一杯です。", stars: "★★★★☆" }
    ],
    meters: { 香り: 75, 甘さ: 65, 満足度: 85 }
  },
  biwa: {
    name: "🌿 枇杷の葉茶タイプ",
    personality: "真面目で誠実、すっきりとした考え方ができるタイプ。コツコツ頑張れる人です。",
    condition: "頭も気分もスッキリさせたい日。軽やかな味わいで、午後の時間が整いそうです。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "リフレッシュハーブティー ＋ タニタコラボプレート", description: "すっきりとした味わいで、食事との相性が良い組み合わせです。", stars: "★★★★★" },
      { rank: "🥈 甘味も楽しむなら", title: "リフレッシュハーブティー ＋ 二色わらび餅", description: "さっぱりしたお茶と甘味のバランスが楽しめます。", stars: "★★★★☆" },
      { rank: "🥉 軽く整えるなら", title: "リフレッシュハーブティー", description: "食後をすっきり締めたい方におすすめです。", stars: "★★★★☆" }
    ],
    meters: { 香り: 80, 甘さ: 50, 満足度: 82 }
  },
  rooibos: {
    name: "🌾 ルイボスティータイプ",
    personality: "親しみやすく、安心感のあるタイプ。自然体で、まわりを和ませる魅力があります。",
    condition: "今日はほっとする満足感が欲しい日。香ばしさと食事の相性を楽しむのがおすすめです。",
    cross: [
      { rank: "🥇 一番おすすめ", title: "ビューティーハーブティー ＋ 焼き魚御膳", description: "香ばしさと和食の相性が良く、満足感のある組み合わせです。", stars: "★★★★★" },
      { rank: "🥈 甘味も楽しむなら", title: "ビューティーハーブティー ＋ 二色わらび餅", description: "香ばしいお茶とやさしい甘味がよく合います。", stars: "★★★★☆" },
      { rank: "🥉 軽く楽しむなら", title: "ビューティーハーブティー", description: "食後にほっとする一杯です。", stars: "★★★★☆" }
    ],
    meters: { 香り: 88, 甘さ: 60, 満足度: 92 }
  }
};

export const kotobaList = ["一期一会", "和敬清寂", "日々是好日", "温故知新", "心静茶味香"];

export function getFallbackResult(type: TeaType, matchRate: number): AiDiagnosisResult {
  const base = localResults[type];
  return {
    ...base,
    matchRate,
    kotoba: kotobaList[Math.floor(Math.random() * kotobaList.length)]
  };
}
