"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
}

export function ProfileHeader({
  displayName,
  username,
  bio,
  avatarUrl,
  tags,
}: ProfileHeaderProps) {
  return (
    <section
      aria-label="프로필 정보"
      className="flex flex-col items-center text-center px-6 pt-10 pb-7"
    >
      {/* 아바타 + 실시간 온라인 상태 점 */}
      <div className="relative w-20 h-20 mb-4">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={avatarUrl}
            alt={`${displayName} 프로필 사진`}
            fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
          />
        </Avatar>
        <span
          aria-label="온라인"
          className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#34C759] border-[2.5px] border-white"
        />
      </div>

      <h1 className="text-[22px] font-bold leading-[1.3] tracking-[-0.015em] text-[#191F28] mb-1">
        {displayName}
      </h1>
      <p className="text-[13px] font-medium text-[#8B95A1] mb-3.5">
        @{username}
      </p>
      <p className="text-[15px] font-normal leading-[1.6] tracking-[-0.005em] text-[#4E5968] mb-5 break-keep">
        {bio}
      </p>

      {/* 관심사/역할 태그 칩 (shadcn/ui Badge × TDS Chip) */}
      <div
        role="list"
        aria-label="관심사"
        className="flex flex-wrap gap-1.5 justify-center"
      >
        {tags.map((tag) => {
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
  );
}
