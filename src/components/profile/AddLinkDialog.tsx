"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LinkBadgeVariant, LinkCategory, LinkItem } from "@/types";

export interface AddLinkDialogProps {
  onAddLink: (
    newLink: Omit<LinkItem, "id" | "order" | "createdAt" | "updatedAt">
  ) => Promise<void> | void;
}

const addLinkSchema = z.object({
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
  description: z
    .string()
    .trim()
    .max(80, "설명은 80자 이내로 입력해 주세요.")
    .optional(),
});

type AddLinkFormValues = z.infer<typeof addLinkSchema>;

const CATEGORY_OPTIONS: {
  value: LinkCategory;
  label: string;
  actionLabel: string;
  icon: "chart" | "web";
}[] = [
  {
    value: "PROJECT",
    label: "🚀 주요 프로젝트",
    actionLabel: "보기",
    icon: "chart",
  },
  {
    value: "BLOG",
    label: "📚 기술 & 블로그",
    actionLabel: "읽기",
    icon: "web",
  },
];

const BADGE_OPTIONS: {
  label: string;
  value: LinkBadgeVariant | "none";
}[] = [
  { label: "배지 없음", value: "none" },
  { label: "NEW", value: "new" },
  { label: "HOT", value: "hot" },
  { label: "추천", value: "brand" },
];

export function AddLinkDialog({ onAddLink }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<LinkCategory>("PROJECT");
  const [badgeType, setBadgeType] = useState<LinkBadgeVariant | "none">("new");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
    mode: "onTouched",
  });

  const resetAll = () => {
    reset({
      title: "",
      url: "",
      description: "",
    });
    setCategory("PROJECT");
    setBadgeType("new");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetAll();
    }
  };

  const onSubmit = async (values: AddLinkFormValues) => {
    const selectedCategory =
      CATEGORY_OPTIONS.find((item) => item.value === category) ??
      CATEGORY_OPTIONS[0];

    const badgeConfig =
      badgeType === "none"
        ? undefined
        : {
            text:
              badgeType === "new"
                ? "NEW"
                : badgeType === "hot"
                ? "HOT"
                : "추천",
            variant: badgeType,
          };

    await onAddLink({
      title: values.title,
      url: values.url,
      description: values.description || undefined,
      category: selectedCategory.value,
      icon: selectedCategory.icon,
      badge: badgeConfig,
      actionLabel: selectedCategory.actionLabel,
      isActive: true,
      clickCount: 0,
    });

    resetAll();
    setOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 pb-6">
      <Button
        type="button"
        variant="default"
        onClick={() => setOpen(true)}
        className="w-full h-[48px] rounded-[14px] text-[15px] font-bold"
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
        새 링크 추가하기
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 링크 추가하기</DialogTitle>
            <DialogDescription>
              프로필 목록에 노출할 새로운 링크 정보를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-3.5"
          >
            {/* 카테고리 선택 */}
            <div className="flex flex-col gap-1.5">
              <Label>카테고리</Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((option) => {
                  const isSelected = category === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCategory(option.value)}
                      className={cn(
                        "h-10 rounded-[12px] text-[13px] font-semibold transition-all cursor-pointer border",
                        isSelected
                          ? "bg-[#E8F3FF] text-[#3182F6] border-[#3182F6]/40"
                          : "bg-[#F9FAFB] text-[#4E5968] border-[#E5E8EB] hover:bg-[#F2F4F6]"
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 제목 입력 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dialog-link-title">제목 *</Label>
              <Input
                id="dialog-link-title"
                type="text"
                placeholder="예: 사이드 프로젝트 데모"
                aria-invalid={Boolean(errors.title)}
                className={cn(
                  errors.title &&
                    "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
                )}
                {...register("title")}
              />
              {errors.title && (
                <p role="alert" className="text-[12px] font-medium text-[#F04452]">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* URL 입력 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dialog-link-url">URL *</Label>
              <Input
                id="dialog-link-url"
                type="url"
                placeholder="https://example.com"
                aria-invalid={Boolean(errors.url)}
                className={cn(
                  errors.url &&
                    "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
                )}
                {...register("url")}
              />
              {errors.url && (
                <p role="alert" className="text-[12px] font-medium text-[#F04452]">
                  {errors.url.message}
                </p>
              )}
            </div>

            {/* 설명 입력 */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dialog-link-desc">설명 (선택)</Label>
              <Input
                id="dialog-link-desc"
                type="text"
                placeholder="링크에 대한 간단한 소개를 적어주세요"
                aria-invalid={Boolean(errors.description)}
                className={cn(
                  errors.description &&
                    "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
                )}
                {...register("description")}
              />
              {errors.description && (
                <p role="alert" className="text-[12px] font-medium text-[#F04452]">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* 강조 배지 선택 */}
            <div className="flex flex-col gap-1.5">
              <Label>강조 배지</Label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {BADGE_OPTIONS.map((item) => {
                  const isSelected = badgeType === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setBadgeType(item.value)}
                      className="bg-transparent border-none p-0 cursor-pointer"
                    >
                      <Badge
                        variant={
                          isSelected
                            ? item.value === "none"
                              ? "brand"
                              : item.value
                            : "outline"
                        }
                        className={cn(
                          "h-[26px] px-2.5 text-[11.5px]",
                          isSelected && "ring-1 ring-[#3182F6]/40"
                        )}
                      >
                        {item.label}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
                className="h-[46px] rounded-[12px] text-[14px] font-bold"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="h-[46px] rounded-[12px] text-[14px] font-bold"
              >
                {isSubmitting ? "저장 중..." : "추가하기"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
