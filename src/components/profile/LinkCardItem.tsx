"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BarChart3,
  Check,
  ChevronRight,
  FileText,
  Globe,
  Loader2,
  Mail,
  MousePointerClick,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardListRow,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteLinkDialog } from "@/components/profile/DeleteLinkDialog";
import { cn } from "@/lib/utils";
import type { LinkIconType, LinkItem } from "@/types";

// 추가할 때(AddLinkDialog)와 동일한 입력 검증 스키마
const editLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "링크 제목을 입력해 주세요.")
    .max(40, "제목은 40자 이내로 입력해 주세요."),
  url: z
    .string()
    .trim()
    .min(1, "이동할 URL을 입력해 주세요.")
    .refine(
      (value) => {
        try {
          const parsed = new URL(value);
          return (
            (parsed.protocol === "http:" || parsed.protocol === "https:") &&
            parsed.hostname.includes(".")
          );
        } catch {
          return false;
        }
      },
      {
        message: "올바른 URL 형식을 입력해 주세요. (예: https://example.com)",
      }
    ),
});

type EditLinkFormValues = z.infer<typeof editLinkSchema>;

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

function getIconConfig(icon?: LinkIconType, url?: string) {
  if (icon === "github" || url?.includes("github.com")) {
    return {
      Icon: GithubOctocatIcon,
      badgeClassName: "bg-white text-[#F43F5E] border border-[#E5E8EB]",
    };
  }
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
    case "mail":
      return {
        Icon: Mail,
        badgeClassName: "bg-white text-[#F57C00] border border-[#E5E8EB]",
      };
    case "web":
    default:
      return {
        Icon: Globe,
        badgeClassName: "bg-white text-[#3182F6] border border-[#E5E8EB]",
      };
  }
}

export interface LinkCardItemProps {
  link: LinkItem;
  isEditable?: boolean;
  onLinkClick?: (id: string) => void;
  onUpdateLink: (
    id: string,
    updatedValues: { title: string; url: string }
  ) => Promise<void> | void;
  onDeleteLink: (id: string) => Promise<void> | void;
}

export function LinkCardItem({
  link,
  isEditable = true,
  onLinkClick,
  onUpdateLink,
  onDeleteLink,
}: LinkCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { Icon, badgeClassName } = getIconConfig(link.icon, link.url);
  const isExternal = link.url.startsWith("http");
  const subtitle = link.description || link.url;
  const clickCount = typeof link.clickCount === "number" ? link.clickCount : 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditLinkFormValues>({
    resolver: zodResolver(editLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    reset({
      title: link.title,
      url: link.url,
    });
  }, [link.title, link.url, reset]);

  const handleStartEdit = () => {
    reset({
      title: link.title,
      url: link.url,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    reset({
      title: link.title,
      url: link.url,
    });
    setIsEditing(false);
  };

  const onSubmitEdit = async (values: EditLinkFormValues) => {
    await onUpdateLink(link.id, {
      title: values.title,
      url: values.url,
    });
    setIsEditing(false);
  };

  // 인라인 편집 UI 모드
  if (isEditing) {
    return (
      <div className="rounded-[16px] bg-white border-2 border-[#3182F6]/60 p-3.5 sm:p-4 shadow-xs transition-all">
        <form
          onSubmit={handleSubmit(onSubmitEdit)}
          noValidate
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`edit-title-${link.id}`}>제목 *</Label>
            <Input
              id={`edit-title-${link.id}`}
              type="text"
              placeholder="링크 제목을 입력해 주세요"
              aria-invalid={Boolean(errors.title)}
              disabled={isSubmitting}
              className={cn(
                "h-10 text-[13.5px]",
                errors.title &&
                  "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
              )}
              {...register("title")}
            />
            {errors.title && (
              <p
                role="alert"
                className="text-[12px] font-medium text-[#F04452]"
              >
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`edit-url-${link.id}`}>URL *</Label>
            <Input
              id={`edit-url-${link.id}`}
              type="url"
              placeholder="https://example.com"
              aria-invalid={Boolean(errors.url)}
              disabled={isSubmitting}
              className={cn(
                "h-10 text-[13.5px]",
                errors.url &&
                  "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
              )}
              {...register("url")}
            />
            {errors.url && (
              <p
                role="alert"
                className="text-[12px] font-medium text-[#F04452]"
              >
                {errors.url.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              onClick={handleCancelEdit}
              className="h-9 px-3.5 rounded-[10px] text-[13px] font-bold"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="h-9 px-3.5 rounded-[10px] text-[13px] font-bold"
            >
              {isSubmitting ? (
                <Loader2
                  className="w-4 h-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  저장
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <CardListRow className="cursor-default active:scale-100">
        {/* 링크 이동 영역 */}
        <Link
          href={link.url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={() => onLinkClick?.(link.id)}
          className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0 no-underline group"
        >
          <span
            className={cn(
              "flex items-center justify-center w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-[12px] shrink-0 shadow-2xs transition-transform group-hover:scale-[1.03]",
              badgeClassName
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </span>

          <div className="flex flex-col gap-0.5 sm:gap-1 flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <CardTitle className="group-hover:text-[#3182F6] transition-colors">
                {link.title}
              </CardTitle>
              {link.badge && (
                <Badge variant={link.badge.variant}>{link.badge.text}</Badge>
              )}
              <span
                className="inline-flex items-center gap-1 rounded-full bg-[#F2F4F6] px-2 py-0.5 text-[11px] font-semibold text-[#4E5968] tabular-nums shrink-0"
                aria-label={`클릭 ${clickCount.toLocaleString()}회`}
                title={`클릭 ${clickCount.toLocaleString()}회`}
              >
                <MousePointerClick
                  className="w-3 h-3 text-[#3182F6]"
                  aria-hidden="true"
                />
                {clickCount.toLocaleString()}
              </span>
            </div>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
        </Link>

        {/* 로그인(편집 가능) 상태일 때만 수정 / 삭제 버튼 노출, 비로그인 시 이동 화살표 표시 */}
        {isEditable ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleStartEdit}
              aria-label={`${link.title} 수정`}
              className="h-8 px-2.5 rounded-[10px] text-[12px] font-semibold"
            >
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              수정
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label={`${link.title} 삭제`}
              className="h-8 px-2.5 rounded-[10px] text-[12px] font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              삭제
            </Button>
          </div>
        ) : (
          <ChevronRight
            className="w-4 h-4 text-[#8B95A1] shrink-0"
            aria-hidden="true"
          />
        )}
      </CardListRow>

      {/* 삭제 확인 모달 */}
      <DeleteLinkDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        linkTitle={link.title}
        onConfirmDelete={() => onDeleteLink(link.id)}
      />
    </>
  );
}
