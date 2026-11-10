"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  LogOut,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ProfileHeaderProps {
  displayName: string;
  email?: string | null;
  bio: string;
  avatarUrl: string;
  isLoggedIn?: boolean;
  isAuthActionLoading?: boolean;
  onGoogleLogin?: () => void;
  onLogout?: () => void;
  onEditProfile?: () => void;
  onPreviewPage?: () => void;
  onCopyPageLink?: () => void;
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

/**
 * 마이페이지 상단 네비게이션 바 (가로형)
 */
export function MyPageTopBar({
  displayName,
  email,
  avatarUrl,
  isLoggedIn = false,
  isAuthActionLoading = false,
  onGoogleLogin,
  onLogout,
  onEditProfile,
  onPreviewPage,
  onCopyPageLink,
  onShare,
}: Omit<ProfileHeaderProps, "bio">) {
  const router = useRouter();
  const personalPageHref = `/${encodeURIComponent(displayName)}`;

  return (
    <header
      aria-label="마이페이지 상단 바"
      className="w-full max-w-[860px] mb-5 rounded-[20px] bg-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border border-[#E5E8EB]/80"
    >
      {/* 좌측: MyLink 로고 */}
      <div className="flex items-center shrink-0">
        <Link
          href="/"
          className="text-[16px] sm:text-[17px] font-extrabold tracking-[-0.02em] text-[#191F28] whitespace-nowrap"
        >
          MyLink
        </Link>
      </div>

      {/* 우측: 마이페이지 이동 버튼 + 프로필 드롭다운(또는 Google 로그인) + 공유 버튼 */}
      <div className="flex items-center gap-2 shrink-0">
        {isLoggedIn ? (
          <>
            <Link
              href={personalPageHref}
              aria-label={`${displayName} 마이페이지로 이동`}
            >
              <Button
                type="button"
                variant="default"
                size="sm"
                tabIndex={-1}
                className="h-9 rounded-full px-3.5 text-[12.5px] font-bold gap-1.5 whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>마이페이지</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isAuthActionLoading}
                aria-label="프로필 메뉴 열기"
                className="inline-flex items-center gap-2 h-9 rounded-full bg-[#F2F4F6] hover:bg-[#E5E8EB] pl-1.5 pr-3 text-[12.5px] font-semibold text-[#191F28] border border-[#E5E8EB]/70 transition-colors whitespace-nowrap"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${displayName} 아바타`}
                    fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                  />
                </Avatar>
                <span className="max-w-[110px] truncate">{displayName}</span>
                {isAuthActionLoading ? (
                  <Loader2
                    className="w-3.5 h-3.5 animate-spin text-[#6B7684] shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#6B7684] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8}>
                {/* 상단 유저 계정 요약 */}
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage
                      src={avatarUrl}
                      alt={`${displayName} 프로필 사진`}
                      fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
                    />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-[#191F28] truncate">
                      {displayName}
                    </p>
                    {email && (
                      <p className="text-[11.5px] font-medium text-[#8B95A1] truncate">
                        {email}
                      </p>
                    )}
                  </div>
                </div>

                <DropdownMenuSeparator />

                {/* 개인별 마이페이지 이동, 프로필 수정, 미리보기 & 링크 복사 액션 */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(personalPageHref)}
                  >
                    <ExternalLink
                      className="w-4 h-4 text-[#3182F6] shrink-0"
                      aria-hidden="true"
                    />
                    <span>마이페이지 이동 (/{displayName})</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={onEditProfile}>
                    <Pencil
                      className="w-4 h-4 text-[#4E5968] shrink-0"
                      aria-hidden="true"
                    />
                    <span>프로필 수정하기</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={onPreviewPage}>
                    <Eye
                      className="w-4 h-4 text-[#4E5968] shrink-0"
                      aria-hidden="true"
                    />
                    <span>내 페이지 미리보기</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={onCopyPageLink}>
                    <Copy
                      className="w-4 h-4 text-[#4E5968] shrink-0"
                      aria-hidden="true"
                    />
                    <span>내 페이지 링크 복사</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 로그아웃 액션 */}
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-[#F04452] hover:bg-[#FFF0F1] data-[highlighted]:bg-[#FFF0F1]"
                >
                  <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isAuthActionLoading}
            onClick={onGoogleLogin}
            aria-label="구글 계정으로 로그인"
            className="h-9 rounded-full px-3.5 text-[12.5px] font-bold whitespace-nowrap"
          >
            {isAuthActionLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <span className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                  <GoogleIcon className="w-3 h-3" />
                </span>
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
    </header>
  );
}

/**
 * 마이페이지 좌측 프로필 요약 섹션
 */
export function ProfileHeader({
  displayName,
  email,
  bio,
  avatarUrl,
  onEditProfile,
}: Pick<
  ProfileHeaderProps,
  "displayName" | "email" | "bio" | "avatarUrl" | "onEditProfile"
>) {
  return (
    <section
      aria-label="프로필 정보"
      className="px-5 sm:px-6 pt-6 pb-4 flex flex-col items-center text-center"
    >
      <div className="relative mb-3.5 rounded-full p-1 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
        <Avatar className="w-[76px] h-[76px] sm:w-[84px] sm:h-[84px]">
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

      <p className="text-[12.5px] sm:text-[13px] font-normal leading-[1.5] tracking-[-0.005em] text-[#6B7684] break-keep px-2 mb-3.5">
        {bio}
      </p>

      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={onEditProfile}
        className="h-8 rounded-full px-4 text-[12px] font-bold gap-1.5 whitespace-nowrap"
      >
        <Pencil className="w-3 h-3" aria-hidden="true" />
        프로필 수정
      </Button>
    </section>
  );
}
