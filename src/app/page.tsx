"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        if (parsed && Array.isArray(parsed.links) && parsed.links.length > 0) {
          setProfile(parsed);
        } else {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_PROFILE_DATA)
          );
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
        title: `${profile.displayName} | 마이링크`,
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F4F6] px-4 pt-6 pb-12">
      {/* ── 메인 프로필 카드 (shadcn/ui Card × TDS 재사용 컴포넌트 조합) ── */}
      <Card className="w-full max-w-[390px]">
        <main role="main">
          <ProfileHeader
            displayName={profile.displayName}
            username={profile.username}
            bio={profile.bio}
            avatarUrl={profile.avatarUrl}
            tags={profile.tags}
          />

          <Separator />

          <ProfileActions
            copied={copied}
            onCopyEmail={handleCopyEmail}
            githubUrl={profile.socialLinks.github}
          />

          <Separator />

          <LinkListSection
            links={activeLinks}
            shared={shared}
            onShare={handleShare}
          />
        </main>
      </Card>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[13px] font-medium text-[#8B95A1]">
          © 2026 {profile.displayName}
        </p>
        <p className="text-[12px] font-normal text-[#B0B8C1]">
          {isMounted ? "Synced with LocalStorage" : "Made with Next.js & TDS"}
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={copied || shared}>
        {copied ? "이메일 복사됐어요 ✓" : "링크 복사됐어요 ✓"}
      </Toast>
    </div>
  );
}
