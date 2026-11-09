"use client";

import { ChevronRight, Share2 } from "lucide-react";
import {
  CardDescription,
  CardListRow,
  CardTitle,
} from "@/components/ui/card";
import { LinkCardItem } from "@/components/profile/LinkCardItem";
import type { LinkItem } from "@/types";

export interface LinkListSectionProps {
  links: LinkItem[];
  shared: boolean;
  onShare: () => void;
}

export function LinkListSection({
  links,
  shared,
  onShare,
}: LinkListSectionProps) {
  return (
    <section aria-label="링크 목록" className="pb-2">
      <div className="flex items-center justify-between px-6 pt-5 pb-2.5">
        <p className="text-[13px] font-semibold text-[#8B95A1]">
          링크 {links.length}
        </p>
      </div>

      <ul role="list" className="flex flex-col px-2.5 pb-1">
        {links.map((link) => (
          <li key={link.id} role="listitem">
            <LinkCardItem link={link} />
          </li>
        ))}

        {/* 프로필 공유하기 로우 (shadcn/ui CardListRow 재사용) */}
        <li role="listitem">
          <button
            type="button"
            onClick={onShare}
            className="w-full text-left bg-transparent border-none p-0 cursor-pointer"
          >
            <CardListRow>
              <span className="flex items-center justify-center w-[42px] h-[42px] rounded-[12px] shrink-0 bg-[#E8F3FF] text-[#3182F6]">
                <Share2 className="w-5 h-5" aria-hidden="true" />
              </span>

              <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
                <CardTitle>
                  {shared ? "링크 복사됐어요 ✓" : "프로필 공유하기"}
                </CardTitle>
                <CardDescription>친구와 동료에게 전달해요</CardDescription>
              </div>

              <span className="text-[#B0B8C1] shrink-0 flex items-center">
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </CardListRow>
          </button>
        </li>
      </ul>
    </section>
  );
}
