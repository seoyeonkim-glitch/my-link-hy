"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { AddLinkDialog } from "@/components/profile/AddLinkDialog";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import { db } from "@/lib/firebase";
import type { LinkItem } from "@/types";

export default function HomePage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2000);
  };

  // Firestore(users/anonymous/links)에서 createdAt 기준 최신순(desc)으로 링크 불러오기
  const fetchLinks = useCallback(async () => {
    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      const q = query(linksRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedLinks: LinkItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title ?? "",
          url: data.url ?? "",
          description: data.description || data.url || "",
          category: data.category,
          icon: data.icon,
          badge: data.badge,
          actionLabel: data.actionLabel ?? "방문",
          isActive: data.isActive ?? true,
          createdAt: data.createdAt ?? "",
        };
      });

      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Firestore 링크 목록 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 페이지 로드 시 Firestore에서 링크 불러오기
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleCopyEmail = () => {
    const email =
      DEFAULT_PROFILE_DATA.socialLinks.email ?? "seoyeonkim@hanyang.ac.kr";
    navigator.clipboard.writeText(email);
    showToast("이메일 복사됐어요 ✓");
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator.share({
        title: `${DEFAULT_PROFILE_DATA.displayName} | MyLink`,
        url: window.location.href,
      });
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("링크 복사됐어요 ✓");
    }
  };

  // 링크 추가 시 Firestore(users/anonymous/links)에 저장 후 목록 즉시 갱신
  const handleAddLink = async (
    newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();

    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      await addDoc(linksRef, {
        title: newLinkInput.title,
        url: newLinkInput.url,
        createdAt: now,
      });

      await fetchLinks();
      showToast("새 링크가 저장됐어요 ✓");
    } catch (error) {
      console.error("Firestore 링크 저장 실패:", error);
      showToast("링크 저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7] px-3 py-6 sm:px-4 sm:py-10">
      {/* ── 메인 프로필 카드 (shadcn/ui Card × TDS 재사용 컴포넌트 조합) ── */}
      <Card className="w-full max-w-[420px]">
        <main role="main">
          <ProfileHeader
            displayName={DEFAULT_PROFILE_DATA.displayName}
            bio={DEFAULT_PROFILE_DATA.bio}
            avatarUrl={DEFAULT_PROFILE_DATA.avatarUrl}
            onShare={handleShare}
          />

          <ProfileActions
            onCopyEmail={handleCopyEmail}
            githubUrl={DEFAULT_PROFILE_DATA.socialLinks.github}
            blogUrl={DEFAULT_PROFILE_DATA.socialLinks.blog}
            portfolioUrl={DEFAULT_PROFILE_DATA.socialLinks.portfolio}
          />

          <LinkListSection links={links} isLoading={isLoading} />

          <AddLinkDialog onAddLink={handleAddLink} />
        </main>
      </Card>

      {/* ── 푸터 영역 ── */}
      <footer className="mt-5 sm:mt-6 flex flex-col items-center gap-0.5">
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#8B95A1]">
          © 2026 {DEFAULT_PROFILE_DATA.displayName}
        </p>
        <p className="text-[11px] sm:text-[11.5px] font-normal text-[#B0B8C1]">
          Synced with Cloud Firestore
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={Boolean(toastMessage)}>{toastMessage}</Toast>
    </div>
  );
}
