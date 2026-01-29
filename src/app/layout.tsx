import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RQProvider from "@/app/_component/RQProvider";

export const metadata: Metadata = {
    title : "사주피드 - 내 운명을 읽다.",
    description : "당신의 사주를 기반으로 한 맞춤형 운세 피드를 제공합니다. 매일 업데이트되는 운세와 인사이트로 더 나은 결정을 내리세요.",
    keywords : ["사주", "운세", "맞춤형 피드", "운명", "인사이트","SHORTS"]
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RQProvider>
            {children}
        </RQProvider>

      </body>
    </html>
  );
}
