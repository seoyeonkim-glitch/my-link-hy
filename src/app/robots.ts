import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/og";

/**
 * 네이버 서치어드바이저(Yeti) 및 검색엔진 크롤러가
 * 서비스 공개 페이지와 소유 확인 파일에 정상 접근할 수 있도록 robots.txt를 생성합니다.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/stats", "/stats/"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
        disallow: ["/stats", "/stats/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/stats", "/stats/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
