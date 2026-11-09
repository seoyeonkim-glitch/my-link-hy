"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { DEFAULT_PROFILE_DATA, STORAGE_KEY } from "@/constants";
import type { LinkItem, MyLinkProfileData } from "@/types";

export default function HomePage() {
  const [profile, setProfile] = useState<MyLinkProfileData>(DEFAULT_PROFILE_DATA);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // [FR-01] 로컬스토리지 연동 및 최초 접속 시 자동 시딩(Auto-Seeding)
  useEffect(() => {
    try {
      const savedData = window.localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as MyLinkProfileData;
        const hasUpdatedSchema =
          parsed &&
          Array.isArray(parsed.links) &&
          parsed.links.length > 0 &&
          Boolean(parsed.links[0]?.actionLabel);

        if (hasUpdatedSchema) {
          setProfile(parsed);
        } else {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_PROFILE_DATA)
          );
          setProfile(DEFAULT_PROFILE_DATA);
        }
      } else {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(DEFAULT_PROFILE_DATA)
        );
      }
    } catch {
      // 로컬스토리지 접근 불가 환경에서는 기본 더미 데이터 유지
    } finally {
      setIsMounted(true);
    }
  }, []);

  const handleCopyEmail = () => {
    const email = profile.socialLinks.email ?? "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: `${profile.displayName} | MyLink`,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  // 활성화(isActive: true)된 링크를 order 순으로 정렬
  const activeLinks: LinkItem[] = [...profile.links]
    .filter((link) => link.isActive)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-4 py-10">
      {/* ── 메인 프로필 카드 (shadcn/ui Card × TDS 재사용 컴포넌트 조합) ── */}
      <Card className="w-full max-w-[420px]">
        <main role="main">
          <ProfileHeader
            displayName={profile.displayName}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            onShare={handleShare}
          />

          <ProfileActions
            onCopyEmail={handleCopyEmail}
            githubUrl={profile.socialLinks.github}
            blogUrl={profile.socialLinks.blog}
            portfolioUrl={profile.socialLinks.portfolio}
          />

          <LinkListSection links={activeLinks} />
        </main>
      </Card>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {profile.displayName}
        </p>
        <p className="text-[11.5px] font-normal text-[#B0B8C1]">
          {isMounted ? "Synced with LocalStorage" : "Made with Next.js & shadcn/ui"}
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={copied || shared}>
        {copied ? "이메일 복사됐어요 ✓" : "링크 복사됐어요 ✓"}
      </Toast>
    </div>
  );
}
