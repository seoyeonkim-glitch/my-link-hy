import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 동적 경로(/[displayName])에서도 크롤러·브라우저가 <head>에서 즉시 OG 메타태그를 읽도록 설정
  htmlLimitedBots: /.*/,
  outputFileTracingIncludes: {
    "/*": ["./src/assets/fonts/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
