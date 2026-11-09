"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LinkCardItem } from "@/components/profile/LinkCardItem";
import type { LinkItem } from "@/types";

export interface LinkListSectionProps {
  links: LinkItem[];
}

export function LinkListSection({ links }: LinkListSectionProps) {
  const projectLinks = links.filter(
    (link) => link.category === "PROJECT" || link.category === "PORTFOLIO"
  );
  const techAndBlogLinks = links.filter(
    (link) =>
      link.category !== "PROJECT" && link.category !== "PORTFOLIO"
  );

  const sections = [
    {
      id: "projects",
      title: "🚀 주요 프로젝트",
      items: projectLinks,
    },
    {
      id: "tech-blog",
      title: "📚 기술 & 블로그",
      items: techAndBlogLinks,
    },
  ].filter((section) => section.items.length > 0);

  return (
    <section aria-label="링크 목록" className="px-6 pb-7 flex flex-col gap-6">
      {sections.map((section) => (
        <div key={section.id} className="flex flex-col gap-3">
          {/* 카테고리 헤더 + 우측 카운트 Badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-[13.5px] font-bold tracking-[-0.01em] text-[#191F28]">
              {section.title}
            </h2>
            <Badge variant="count">{section.items.length}</Badge>
          </div>

          <Separator />

          {/* 개별 링크 카드 목록 */}
          <ul role="list" className="flex flex-col gap-2.5 pt-0.5">
            {section.items.map((link) => (
              <li key={link.id} role="listitem">
                <LinkCardItem link={link} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
