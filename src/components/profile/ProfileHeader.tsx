"use client";

import { ArrowUpRight, Loader2, LogOut } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface ProfileHeaderProps {
  displayName: string;
  email?: string | null;
  bio: string;
  avatarUrl: string;
  isLoggedIn?: boolean;
  isAuthActionLoading?: boolean;
  onGoogleLogin?: () => void;
  onLogout?: () => void;
  onShare: () => void;
}

export function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function ProfileHeader({
  displayName,
  email,
  bio,
  avatarUrl,
  isLoggedIn = false,
  isAuthActionLoading = false,
  onGoogleLogin,
  onLogout,
  onShare,
}: ProfileHeaderProps) {
  return (
    <header aria-label="프로필 정보" className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
      {/* 상단 바: 좌측 MyLink 로고 & 마이페이지 배지 + 우측 구글 로그인/로그아웃 및 공유 버튼 */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[15px] sm:text-[16px] font-extrabold tracking-[-0.02em] text-[#191F28]">
            MyLink
          </span>
          <span className="inline-flex items-center rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3182F6]">
            마이페이지
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isAuthActionLoading}
              onClick={onLogout}
              aria-label="로그아웃"
              className="h-9 rounded-full px-3.5 text-[12.5px] font-semibold text-[#4E5968] hover:text-[#191F28]"
            >
              {isAuthActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  로그아웃
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isAuthActionLoading}
              onClick={onGoogleLogin}
              aria-label="구글 계정으로 로그인"
              className="h-9 rounded-full px-3.5 text-[12.5px] font-semibold border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F2F4F6]"
            >
              {isAuthActionLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <GoogleIcon className="w-3.5 h-3.5" />
                  Google 로그인
                </>
              )}
            </Button>
          )}

          <Button
            type="button"
            variant="iconCircle"
            size="iconSm"
            onClick={onShare}
            aria-label="프로필 공유하기"
            title="프로필 링크 공유하기"
          >
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* 로그인 시 중앙 아바타 + 유저 정보(이름, 이메일/계정, 소개글) 노출 */}
      {isLoggedIn && (
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3.5 rounded-full p-1 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
            <Avatar className="w-[76px] h-[76px] sm:w-[82px] sm:h-[82px]">
              <AvatarImage
                src={avatarUrl}
                alt={`${displayName} 프로필 사진`}
                fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
              />
            </Avatar>
            {/* 온라인 상태 뱃지 */}
            <span
              className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#34C759] ring-2 ring-white"
              aria-label="온라인"
              title="로그인됨"
            />
          </div>

          <h1 className="text-[19px] sm:text-[20px] font-bold leading-[1.3] tracking-[-0.015em] text-[#191F28] mb-0.5">
            {displayName}
          </h1>

          {email && (
            <p className="text-[12.5px] font-medium text-[#8B95A1] mb-2">
              {email}
            </p>
          )}

          <p className="text-[12.5px] sm:text-[13px] font-normal leading-[1.5] tracking-[-0.005em] text-[#6B7684] break-keep px-2">
            {bio}
          </p>
        </div>
      )}
    </header>
  );
}
