import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "あなたをお茶にたとえると？",
  description: "AIがあなたの回答をもとに、性格に合う茶タイプとおすすめセットを診断します。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
