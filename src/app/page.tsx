"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { AddLinkDialog } from "@/components/profile/AddLinkDialog";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import type { LinkItem, MyLinkProfileData } from "@/types";

export default function HomePage() {
  const [profile, setProfile] = useState<MyLinkProfileData>(DEFAULT_PROFILE_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2000);
  };

  const handleCopyEmail = () => {
    const email = profile.socialLinks.email ?? "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    showToast("이메일 복사됐어요 ✓");
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: `${profile.displayName} | MyLink`,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("링크 복사됐어요 ✓");
    }
  };

  // 로컬 상태(useState)에만 새 링크 추가 (새로고침 시 초기 더미 데이터로 리셋)
  const handleAddLink = (
    newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `link-${Date.now()}`;

    setProfile((prev) => {
      const nextOrder =
        prev.links.reduce((max, item) => Math.max(max, item.order ?? 0), 0) + 1;

      const createdLink: LinkItem = {
        ...newLinkInput,
        id: newId,
        userId: "user_seoyeon_01",
        order: nextOrder,
        createdAt: now,
        updatedAt: now,
      };

      return {
        ...prev,
        links: [...prev.links, createdLink],
        updatedAt: now,
      };
    });

    showToast("새 링크가 추가됐어요 ✓");
  };

  // 활성화(isActive: true)된 링크를 order 순으로 정렬
  const activeLinks: LinkItem[] = [...profile.links]
    .filter((link) => link.isActive)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
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

          <AddLinkDialog onAddLink={handleAddLink} />
        </main>
      </Card>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {profile.displayName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Made with Next.js & shadcn/ui
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={Boolean(toastMessage)}>{toastMessage}</Toast>
    </div>
  );
}
