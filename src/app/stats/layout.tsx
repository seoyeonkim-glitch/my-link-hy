import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "링크 클릭 통계",
  description: "등록한 링크의 클릭수와 인기 순위를 차트로 확인해요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
    title: "링크 클릭 통계 | MyLink",
    description: "등록한 링크의 클릭수와 인기 순위를 차트로 확인해요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "링크 클릭 통계 | MyLink",
    description: "등록한 링크의 클릭수와 인기 순위를 차트로 확인해요.",
  },
};

export default function StatsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
