"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface ProfileActionsProps {
  copied: boolean;
  onCopyEmail: () => void;
  githubUrl?: string;
}

export function ProfileActions({
  copied,
  onCopyEmail,
  githubUrl,
}: ProfileActionsProps) {
  return (
    <section aria-label="주요 액션" className="flex flex-col gap-2.5 px-6 py-5">
      {/* 화면당 단 1개의 Primary CTA (blue-500) */}
      <Button
        type="button"
        variant="default"
        onClick={onCopyEmail}
        className="w-full"
      >
        {copied ? "이메일 복사됐어요 ✓" : "이메일로 연락하기"}
      </Button>

      {/* Secondary 액션 버튼 */}
      {githubUrl && (
        <Link
          href={githubUrl}
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
  );
}
