"use client";

import Link from "next/link";
import { ChevronRight, Copy, Eye, Globe } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { LinkItem } from "@/types";

export interface PreviewProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  email?: string | null;
  bio: string;
  avatarUrl: string;
  links: LinkItem[];
  onCopyLink: () => void;
}

export function PreviewProfileDialog({
  open,
  onOpenChange,
  displayName,
  email,
  bio,
  avatarUrl,
  links,
  onCopyLink,
}: PreviewProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-3 bg-[#F9FAFB] border-b border-[#E5E8EB]">
          <DialogHeader className="mb-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-bold text-[#3182F6]">
                <Eye className="w-3 h-3" aria-hidden="true" />
                방문자 화면
              </span>
              <DialogTitle className="text-[16px]">내 페이지 미리보기</DialogTitle>
            </div>
            <DialogDescription className="text-[12px] mt-1">
              다른 사람에게 공유했을 때 보이는 내 페이지 화면이에요.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 방문자용 프리뷰 본문 */}
        <div className="px-5 py-5 max-h-[65vh] overflow-y-auto flex flex-col items-center text-center">
          <div className="relative mb-3 rounded-full p-1 bg-gradient-to-tr from-[#E8F3FF] via-[#F2F4F6] to-[#E8F3FF] border border-[#E5E8EB]/80">
            <Avatar className="w-[68px] h-[68px]">
              <AvatarImage
                src={avatarUrl}
                alt={`${displayName} 프로필 사진`}
                fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces"
              />
            </Avatar>
            <span
              className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#34C759] ring-2 ring-white"
              aria-hidden="true"
            />
          </div>

          <h3 className="text-[18px] font-bold text-[#191F28] mb-0.5">
            {displayName}
          </h3>
          {email && (
            <p className="text-[12px] font-medium text-[#8B95A1] mb-1.5">
              {email}
            </p>
          )}
          <p className="text-[12.5px] text-[#6B7684] leading-[1.5] break-keep mb-4 px-2">
            {bio}
          </p>

          <Separator className="mb-4" />

          {/* 방문자용 링크 리스트 */}
          <div className="w-full text-left">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12.5px] font-bold text-[#191F28]">
                🔗 링크 목록
              </span>
              <Badge variant="count">{links.length}</Badge>
            </div>

            {links.length === 0 ? (
              <div className="py-6 text-center rounded-[14px] bg-[#F9FAFB] border border-dashed border-[#E5E8EB]">
                <p className="text-[12.5px] font-medium text-[#8B95A1]">
                  아직 등록된 링크가 없어요
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-[14px] border border-[#E5E8EB] bg-white p-3 hover:bg-[#F2F4F6]/70 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E8F3FF] text-[#3182F6]">
                          <Globe className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-bold text-[#191F28] truncate">
                            {link.title}
                          </p>
                          <p className="text-[11.5px] text-[#8B95A1] truncate">
                            {link.url}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-[#8B95A1] shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="px-5 py-3.5 bg-[#F9FAFB] border-t border-[#E5E8EB] grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="h-[44px] rounded-[12px] text-[13.5px] font-bold"
          >
            닫기
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={onCopyLink}
            className="h-[44px] rounded-[12px] text-[13.5px] font-bold"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            내 페이지 링크 복사
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
