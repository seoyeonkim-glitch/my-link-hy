"use client";

import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface ProfileHeaderProps {
  displayName: string;
  bio: string;
  avatarUrl: string;
  onShare: () => void;
}

export function ProfileHeader({
  displayName,
  bio,
  avatarUrl,
  onShare,
}: ProfileHeaderProps) {
  return (
    <header aria-label="프로필 정보" className="px-6 pt-6 pb-4">
      {/* 상단 바: 좌측 MyLink 로고 + 우측 공유 아이콘 버튼 */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-extrabold tracking-[-0.02em] text-[#191F28]">
          MyLink
        </span>
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

      {/* 중앙 아바타 + 이름 + 한 줄 소개 */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3.5 rounded-full p-1 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
          <Avatar className="w-[82px] h-[82px]">
            <AvatarImage
              src={avatarUrl}
              alt={`${displayName} 프로필 사진`}
              fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
            />
          </Avatar>
        </div>

        <h1 className="text-[20px] font-bold leading-[1.3] tracking-[-0.015em] text-[#191F28] mb-1.5">
          {displayName}
        </h1>
        <p className="text-[13px] font-normal leading-[1.5] tracking-[-0.005em] text-[#6B7684] break-keep">
          {bio}
        </p>
      </div>
    </header>
  );
}
