import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { decodeDisplayName, fetchPublicProfileForOg } from "@/lib/og";
import { PublicProfileClient } from "./PublicProfileClient";

type PageProps = {
  params: Promise<{ displayName: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { displayName: rawDisplayName } = await params;
  const decodedHandle = decodeDisplayName(rawDisplayName);
  const profile = await fetchPublicProfileForOg(decodedHandle, {
    includeLinks: false,
    timeoutMs: 1800,
  });

  const resolvedName = profile?.displayName || decodedHandle || "프로필";
  const resolvedBio =
    profile?.bio ||
    `${resolvedName}님의 모든 링크를 MyLink에서 한눈에 확인해 보세요.`;
  const canonicalPath = decodedHandle
    ? `/${encodeURIComponent(decodedHandle)}`
    : "/";

  return {
    title: resolvedName,
    description: resolvedBio,
    keywords: [resolvedName, "MyLink", "마이링크", "프로필 링크", "링크 모음"],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "profile",
      locale: "ko_KR",
      siteName: "MyLink",
      title: `${resolvedName} | MyLink`,
      description: resolvedBio,
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: `${resolvedName} | MyLink`,
      description: resolvedBio,
    },
  };
}

function PublicProfileFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      <Card className="w-full max-w-[420px] px-6 py-14 flex flex-col items-center justify-center gap-3 text-center">
        <Loader2
          className="w-7 h-7 text-[#3182F6] animate-spin"
          aria-hidden="true"
        />
        <p className="text-[13.5px] font-medium text-[#6B7684]">
          프로필 페이지를 불러오고 있어요...
        </p>
      </Card>
    </div>
  );
}

/**
 * Next.js 16 Cache Components 환경에서 동적 메타데이터(generateMetadata)가
 * 런타임 요청임을 명시해 프리렌더 차단 에러를 방지하는 마커 컴포넌트입니다.
 */
async function DynamicMetadataConnection() {
  await connection();
  return null;
}

export default function UserPublicProfilePage() {
  return (
    <>
      <Suspense fallback={<PublicProfileFallback />}>
        <PublicProfileClient />
      </Suspense>
      <Suspense>
        <DynamicMetadataConnection />
      </Suspense>
    </>
  );
}
