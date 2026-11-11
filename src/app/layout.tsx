import type { Metadata } from "next";
import { QueryProvider } from "@/components/common/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { getSiteUrl } from "@/lib/og";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MyLink | Every Link in One Link.",
    template: "%s | MyLink",
  },
  description:
    "GitHub, 블로그, 포트폴리오까지. 나만의 모든 링크를 한 페이지에 담아 관리하고 공유해 보세요.",
  // 검색엔진 최적화를 위한 기본 키워드 및 크롤링 허용 설정
  keywords: [
    "MyLink",
    "마이링크",
    "링크 모음",
    "링크 인 바이오",
    "프로필 링크",
    "개발자 포트폴리오",
    "링크 관리",
    "link in bio",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "MyLink",
    title: "MyLink | Every Link in One Link.",
    description:
      "GitHub, 블로그, 포트폴리오까지. 나만의 모든 링크를 한 페이지에 담아 관리하고 공유해 보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink | Every Link in One Link.",
    description:
      "GitHub, 블로그, 포트폴리오까지. 나만의 모든 링크를 한 페이지에 담아 관리하고 공유해 보세요.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
