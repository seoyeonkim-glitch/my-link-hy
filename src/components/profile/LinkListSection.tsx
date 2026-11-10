"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkCardItem } from "@/components/profile/LinkCardItem";
import type { LinkItem } from "@/types";

export interface LinkListSectionProps {
  links: LinkItem[];
  isLoading?: boolean;
  isEditable?: boolean;
  onUpdateLink: (
    id: string,
    updatedValues: { title: string; url: string }
  ) => Promise<void> | void;
  onDeleteLink: (id: string) => Promise<void> | void;
}

export function LinkListSection({
  links,
  isLoading = false,
  isEditable = true,
  onUpdateLink,
  onDeleteLink,
}: LinkListSectionProps) {
  return (
    <section
      aria-label="링크 목록"
      className="px-4 sm:px-6 pb-6 sm:pb-7 flex flex-col gap-3"
    >
      {/* 헤더 + 우측 로딩 표시 및 카운트 Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] sm:text-[13.5px] font-bold tracking-[-0.01em] text-[#191F28]">
            🔗 등록된 링크
          </h2>
          {isLoading && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#3182F6]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
              갱신 중...
            </span>
          )}
        </div>
        <Badge variant="count">{links.length}</Badge>
      </div>

      <Separator />

      {/* 로딩 중 표시 (초기 로드 시) */}
      {isLoading && links.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2.5 py-8 rounded-[16px] bg-[#F9FAFB] border border-[#E5E8EB]/80"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2
            className="w-6 h-6 text-[#3182F6] animate-spin"
            aria-hidden="true"
          />
          <p className="text-[13px] font-medium text-[#6B7684]">
            링크 목록을 불러오고 있어요...
          </p>
        </div>
      ) : links.length === 0 ? (
        <div className="py-8 text-center rounded-[16px] bg-[#F9FAFB] border border-dashed border-[#E5E8EB]">
          <p className="text-[13.5px] font-semibold text-[#4E5968] mb-1">
            아직 등록된 링크가 없어요
          </p>
          <p className="text-[12px] text-[#8B95A1]">
            {isEditable
              ? "위 버튼을 눌러 첫 번째 링크를 추가해 보세요!"
              : "로그인 이후에 첫 번째 링크를 추가할 수 있어요."}
          </p>
        </div>
      ) : (
        <ul role="list" className="flex flex-col gap-2 sm:gap-2.5 pt-0.5">
          {links.map((link) => (
            <li key={link.id} role="listitem">
              <LinkCardItem
                link={link}
                isEditable={isEditable}
                onUpdateLink={onUpdateLink}
                onDeleteLink={onDeleteLink}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
