"use client";

import Link from "next/link";
import { ChevronRight, Globe, Mail } from "lucide-react";
import {
  CardDescription,
  CardListRow,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LinkIconType, LinkItem } from "@/types";

function GithubIcon({ className }: { className?: string }) {
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
    case "github":
      return {
        Icon: GithubIcon,
        badgeClassName: "bg-[#F0F0FF] text-[#6366F1]",
      };
    case "mail":
      return {
        Icon: Mail,
        badgeClassName: "bg-[#FFF3E0] text-[#F57C00]",
      };
    case "web":
    default:
      return {
        Icon: Globe,
        badgeClassName: "bg-[#E8F3FF] text-[#3182F6]",
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
            "flex items-center justify-center w-[42px] h-[42px] rounded-[12px] shrink-0",
            badgeClassName
          )}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
          <CardTitle>{link.title}</CardTitle>
          {link.description && (
            <CardDescription>{link.description}</CardDescription>
          )}
        </div>

        <span className="text-[#B0B8C1] shrink-0 flex items-center">
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </CardListRow>
    </Link>
  );
}
