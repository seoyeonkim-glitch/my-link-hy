"use client";

import Link from "next/link";
import { Briefcase, Globe, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProfileActionsProps {
  onCopyEmail: () => void;
  githubUrl?: string;
  blogUrl?: string;
  portfolioUrl?: string;
}

export function ProfileActions({
  onCopyEmail,
  githubUrl = "https://github.com/seoyeonkim-glitch",
  blogUrl = "https://velog.io/@seoyeonkim-glitch",
  portfolioUrl = "https://notion.so/seoyeonkim-portfolio",
}: ProfileActionsProps) {
  return (
    <nav
      aria-label="소셜 및 빠른 액션"
      className="flex items-center justify-center gap-3 px-6 pb-6"
    >
      <Link
        href={blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="블로그 방문하기"
      >
        <Button
          type="button"
          variant="iconCircle"
          size="icon"
          tabIndex={-1}
          className="text-[#EC4899]"
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
        </Button>
      </Link>

      <Link
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="포트폴리오 보기"
      >
        <Button
          type="button"
          variant="iconCircle"
          size="icon"
          tabIndex={-1}
          className="text-[#8B5CF6]"
        >
          <Briefcase className="w-4 h-4" aria-hidden="true" />
        </Button>
      </Link>

      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub 프로필 방문하기"
      >
        <Button
          type="button"
          variant="iconCircle"
          size="icon"
          tabIndex={-1}
          className="text-[#F43F5E]"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
        </Button>
      </Link>

      <Button
        type="button"
        variant="iconCircle"
        size="icon"
        onClick={onCopyEmail}
        aria-label="이메일 주소 복사하기"
        title="이메일 복사하기"
        className="text-[#6366F1]"
      >
        <Mail className="w-4 h-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
