"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { LinkListSection } from "@/components/profile/LinkListSection";
import { AddLinkDialog } from "@/components/profile/AddLinkDialog";
import { DEFAULT_PROFILE_DATA } from "@/constants";
import { db } from "@/lib/firebase";
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

  // 마운트 시 Firestore(users/anonymous/links)에 저장된 링크 목록 불러오기
  useEffect(() => {
    const fetchFirestoreLinks = async () => {
      try {
        const linksRef = collection(db, "users", "anonymous", "links");
        const q = query(linksRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const firestoreLinks: LinkItem[] = snapshot.docs.map((docSnap, idx) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId ?? "anonymous",
              title: data.title ?? "",
              url: data.url ?? "",
              description: data.description || undefined,
              category: data.category ?? "PROJECT",
              icon: data.icon ?? "chart",
              badge: data.badge || undefined,
              actionLabel: data.actionLabel ?? "보기",
              order: data.order ?? DEFAULT_PROFILE_DATA.links.length + idx + 1,
              isActive: data.isActive ?? true,
              clickCount: data.clickCount ?? 0,
              createdAt:
                typeof data.createdAt === "string"
                  ? data.createdAt
                  : new Date().toISOString(),
              updatedAt:
                typeof data.updatedAt === "string"
                  ? data.updatedAt
                  : new Date().toISOString(),
            };
          });

          setProfile((prev) => {
            const existingIds = new Set(DEFAULT_PROFILE_DATA.links.map((l) => l.id));
            const uniqueNewLinks = firestoreLinks.filter(
              (l) => !existingIds.has(l.id)
            );
            return {
              ...prev,
              links: [...DEFAULT_PROFILE_DATA.links, ...uniqueNewLinks],
            };
          });
        }
      } catch (error) {
        console.error("Firestore 링크 목록 조회 실패:", error);
      }
    };

    fetchFirestoreLinks();
  }, []);

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

  // Firestore(users/anonymous/links)에 새 링크 저장 후 화면 반영
  const handleAddLink = async (
    newLinkInput: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    const nextOrder =
      profile.links.reduce((max, item) => Math.max(max, item.order ?? 0), 0) + 1;

    // Firestore는 undefined 값을 허용하지 않으므로 유효한 필드만 구성
    const firestorePayload: Record<string, unknown> = {
      userId: "anonymous",
      title: newLinkInput.title,
      url: newLinkInput.url,
      category: newLinkInput.category ?? "PROJECT",
      icon: newLinkInput.icon ?? "chart",
      actionLabel: newLinkInput.actionLabel ?? "보기",
      order: nextOrder,
      isActive: true,
      clickCount: 0,
      createdAt: now,
      updatedAt: now,
      timestamp: serverTimestamp(),
    };

    if (newLinkInput.description) {
      firestorePayload.description = newLinkInput.description;
    }
    if (newLinkInput.badge) {
      firestorePayload.badge = newLinkInput.badge;
    }

    try {
      const linksRef = collection(db, "users", "anonymous", "links");
      const docRef = await addDoc(linksRef, firestorePayload);

      const createdLink: LinkItem = {
        ...newLinkInput,
        id: docRef.id,
        userId: "anonymous",
        order: nextOrder,
        createdAt: now,
        updatedAt: now,
      };

      setProfile((prev) => ({
        ...prev,
        links: [...prev.links, createdLink],
        updatedAt: now,
      }));

      showToast("새 링크가 저장됐어요 ✓");
    } catch (error) {
      console.error("Firestore 링크 저장 실패:", error);
      showToast("링크 저장에 실패했어요. 다시 시도해 주세요.");
    }
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
          Synced with Cloud Firestore
        </p>
      </footer>

      {/* ── 토스트 피드백 (shadcn/ui Toast) ── */}
      <Toast visible={Boolean(toastMessage)}>{toastMessage}</Toast>
    </div>
  );
}
