"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkCardItem } from "@/components/profile/LinkCardItem";
import type { LinkItem } from "@/types";

export interface LinkListSectionProps {
  links: LinkItem[];
  isLoading?: boolean;
}

export function LinkListSection({
  links,
  isLoading = false,
}: LinkListSectionProps) {
  return (
    <section
      aria-label="링크 목록"
      className="px-4 sm:px-6 pb-6 sm:pb-7 flex flex-col gap-3"
    >
      {/* 헤더 + 우측 카운트 Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-[#191F28]">
          🔗 등록된 링크
        </h2>
        <Badge variant="count">{links.length}</Badge>
      </div>

      <Separator />

      {/* 로딩 중 스켈레톤 / 빈 목록 안내 / 최신순 링크 카드 목록 */}
      {isLoading ? (
        <div className="flex flex-col gap-2.5 pt-1" aria-busy="true">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-[72px] w-full rounded-[16px] bg-[#F2F4F6] animate-pulse"
            />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="py-8 text-center rounded-[16px] bg-[#F9FAFB] border border-dashed border-[#E5E8EB]">
          <p className="text-[13.5px] font-semibold text-[#4E5968] mb-1">
            아직 등록된 링크가 없어요
          </p>
          <p className="text-[12px] text-[#8B95A1]">
            아래 버튼을 눌러 첫 번째 링크를 추가해 보세요!
          </p>
        </div>
      ) : (
        <ul role="list" className="flex flex-col gap-2 sm:gap-2.5 pt-0.5">
          {links.map((link) => (
            <li key={link.id} role="listitem">
              <LinkCardItem link={link} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
