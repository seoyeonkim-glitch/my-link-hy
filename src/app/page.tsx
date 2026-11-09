"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Globe,
  Mail,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toast } from "@/components/ui/toast";
import { DEFAULT_PROFILE_DATA, STORAGE_KEY } from "@/constants";
import type { LinkIconType, LinkItem, MyLinkProfileData } from "@/types";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function getIconConfig(icon?: LinkIconType) {
  switch (icon) {
    case "github":
      return {
        Icon: GithubIcon,
        badgeClassName: "bg-[#F0F0FF] text-[#6366F1]",
      };
    case "mail":
      return {
        Icon: Mail,
        badgeClassName: "bg-[#FFF3E0] text-[#F57C00]",
      };
    case "web":
    default:
      return {
        Icon: Globe,
        badgeClassName: "bg-[#E8F3FF] text-[#3182F6]",
      };
  }
}

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
      {/* ── 메인 프로필 카드 (shadcn/ui Card × TDS) ── */}
      <Card className="w-full max-w-[390px]">
        <main role="main">
          {/* 1. 프로필 헤더 영역 */}
          <section
            aria-label="프로필 정보"
            className="flex flex-col items-center text-center px-6 pt-10 pb-7"
          >
            {/* 아바타 + 실시간 온라인 상태 점 */}
            <div className="relative w-20 h-20 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={`${profile.displayName} 프로필 사진`}
                className="w-20 h-20 rounded-full object-cover block bg-[#F2F4F6]"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces";
                }}
              />
              <span
                aria-label="온라인"
                className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#34C759] border-[2.5px] border-white"
              />
            </div>

            <h1 className="text-[22px] font-bold leading-[1.3] tracking-[-0.015em] text-[#191F28] mb-1">
              {profile.displayName}
            </h1>
            <p className="text-[13px] font-medium text-[#8B95A1] mb-3.5">
              @{profile.username}
            </p>
            <p className="text-[15px] font-normal leading-[1.6] tracking-[-0.005em] text-[#4E5968] mb-5 break-keep">
              {profile.bio}
            </p>

            {/* 관심사/역할 태그 칩 (shadcn/ui Badge × TDS Chip) */}
            <div
              role="list"
              aria-label="관심사"
              className="flex flex-wrap gap-1.5 justify-center"
            >
              {profile.tags.map((tag) => {
                const isBrandTag = tag.includes("Next.js");
                return (
                  <Badge
                    key={tag}
                    role="listitem"
                    variant={isBrandTag ? "brand" : "default"}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </section>

          <Separator />

          {/* 2. 주요 액션 버튼 영역 (shadcn/ui Button × TDS) */}
          <section
            aria-label="주요 액션"
            className="flex flex-col gap-2.5 px-6 py-5"
          >
            {/* 화면당 단 1개의 Primary CTA (blue-500) */}
            <Button
              type="button"
              variant="default"
              onClick={handleCopyEmail}
              className="w-full"
            >
              {copied ? "이메일 복사됐어요 ✓" : "이메일로 연락하기"}
            </Button>

            {/* Secondary 액션 버튼 */}
            {profile.socialLinks.github && (
              <Link
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full no-underline"
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  tabIndex={-1}
                >
                  GitHub 방문하기
                </Button>
              </Link>
            )}
          </section>

          <Separator />

          {/* 3. 링크 목록 영역 (TDS list-row 패턴) */}
          <section aria-label="링크 목록" className="pb-2">
            <div className="flex items-center justify-between px-6 pt-5 pb-2.5">
              <p className="text-[13px] font-semibold text-[#8B95A1]">
                링크 {activeLinks.length}
              </p>
            </div>

            <ul role="list" className="flex flex-col px-2.5 pb-1">
              {activeLinks.map((link) => {
                const { Icon, badgeClassName } = getIconConfig(link.icon);
                const isExternal = link.url.startsWith("http");

                return (
                  <li key={link.id} role="listitem">
                    <Link
                      href={link.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-[14px] p-3.5 rounded-[16px] text-[#191F28] no-underline transition-colors hover:bg-[#F2F4F6] active:bg-[#F2F4F6]"
                    >
                      <span
                        className={`flex items-center justify-center w-[42px] h-[42px] rounded-[12px] shrink-0 ${badgeClassName}`}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </span>

                      <span className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
                        <span className="text-[15px] font-semibold tracking-[-0.005em] text-[#191F28] truncate">
                          {link.title}
                        </span>
                        {link.description && (
                          <span className="text-[13px] font-normal text-[#8B95A1] truncate">
                            {link.description}
                          </span>
                        )}
                      </span>

                      <span className="text-[#B0B8C1] shrink-0 flex items-center">
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                );
              })}

              {/* 프로필 공유하기 로우 */}
              <li role="listitem">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full text-left flex items-center gap-[14px] p-3.5 rounded-[16px] text-[#191F28] bg-transparent border-none cursor-pointer transition-colors hover:bg-[#F2F4F6] active:bg-[#F2F4F6]"
                >
                  <span className="flex items-center justify-center w-[42px] h-[42px] rounded-[12px] shrink-0 bg-[#E8F3FF] text-[#3182F6]">
                    <Share2 className="w-5 h-5" aria-hidden="true" />
                  </span>

                  <span className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
                    <span className="text-[15px] font-semibold tracking-[-0.005em] text-[#191F28] truncate">
                      {shared ? "링크 복사됐어요 ✓" : "프로필 공유하기"}
                    </span>
                    <span className="text-[13px] font-normal text-[#8B95A1] truncate">
                      친구와 동료에게 전달해요
                    </span>
                  </span>

                  <span className="text-[#B0B8C1] shrink-0 flex items-center">
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>
              </li>
            </ul>
          </section>
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
