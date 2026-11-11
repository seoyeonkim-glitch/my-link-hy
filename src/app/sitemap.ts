import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/og";

/**
 * 네이버 서치어드바이저 및 검색엔진 수집을 위한 sitemap.xml을 생성합니다.
 * Next.js 16 Cache Components 프리렌더 규칙에 맞춰 결정적 날짜 문자열을 사용합니다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      lastModified: "2026-11-11T00:00:00.000Z",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
