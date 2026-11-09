"use client";

import Link from "next/link";
import {
  BarChart3,
  ChevronRight,
  FileText,
  Mail,
  PenTool,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  CardDescription,
  CardListRow,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LinkIconType, LinkItem } from "@/types";

function GithubOctocatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function getIconConfig(icon?: LinkIconType) {
  switch (icon) {
    case "chart":
      return {
        Icon: BarChart3,
        badgeClassName: "bg-white text-[#10B981] border border-[#E5E8EB]",
      };
    case "file":
      return {
        Icon: FileText,
        badgeClassName: "bg-white text-[#6B7684] border border-[#E5E8EB]",
      };
    case "github":
      return {
        Icon: GithubOctocatIcon,
        badgeClassName: "bg-white text-[#F43F5E] border border-[#E5E8EB]",
      };
    case "mail":
      return {
        Icon: Mail,
        badgeClassName: "bg-white text-[#F57C00] border border-[#E5E8EB]",
      };
    case "web":
    default:
      return {
        Icon: PenTool,
        badgeClassName: "bg-white text-[#F59E0B] border border-[#E5E8EB]",
      };
  }
}

export interface LinkCardItemProps {
  link: LinkItem;
}

export function LinkCardItem({ link }: LinkCardItemProps) {
  const { Icon, badgeClassName } = getIconConfig(link.icon);
  const isExternal = link.url.startsWith("http");

  return (
    <Link
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block no-underline"
    >
      <CardListRow>
        <span
          className={cn(
            "flex items-center justify-center w-[42px] h-[42px] rounded-[12px] shrink-0 shadow-2xs",
            badgeClassName
          )}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CardTitle>{link.title}</CardTitle>
            {link.badge && (
              <Badge variant={link.badge.variant}>{link.badge.text}</Badge>
            )}
          </div>
          {link.description && (
            <CardDescription>{link.description}</CardDescription>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {link.actionLabel && (
            <Badge variant="action">{link.actionLabel}</Badge>
          )}
          <ChevronRight
            className="w-3.5 h-3.5 text-[#B0B8C1]"
            aria-hidden="true"
          />
        </div>
      </CardListRow>
    </Link>
  );
}
