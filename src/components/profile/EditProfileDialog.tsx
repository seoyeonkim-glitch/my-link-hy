"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil } from "lucide-react";
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

const editProfileSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(80, "한 줄 소개는 80자 이내로 입력해 주세요."),
  photoURL: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) return true;
        try {
          const parsed = new URL(value);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "올바른 이미지 URL 형식을 입력해 주세요. (https://...)",
      }
    ),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string;
  currentPhotoURL: string;
  onUpdateProfile: (values: {
    bio: string;
    photoURL: string;
  }) => Promise<void>;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  currentBio,
  currentPhotoURL,
  onUpdateProfile,
}: EditProfileDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: currentBio,
      photoURL: currentPhotoURL,
    },
    mode: "onTouched",
  });

  // 모달이 열릴 때 현재 프로필 값으로 초기화
  useEffect(() => {
    if (open) {
      reset({
        bio: currentBio,
        photoURL: currentPhotoURL,
      });
    }
  }, [open, currentBio, currentPhotoURL, reset]);

  const onSubmit = async (values: EditProfileFormValues) => {
    await onUpdateProfile({
      bio: values.bio.trim(),
      photoURL: values.photoURL.trim(),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <Pencil className="w-4 h-4 text-[#3182F6]" aria-hidden="true" />
            프로필 수정하기
          </DialogTitle>
          <DialogDescription>
            마이페이지에 표시될 한 줄 소개와 프로필 사진을 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3.5"
        >
          {/* 한 줄 소개 (Bio) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-bio">한 줄 소개</Label>
            <Input
              id="profile-bio"
              type="text"
              placeholder="나를 표현하는 한 줄 소개를 입력해 주세요"
              aria-invalid={Boolean(errors.bio)}
              className={cn(
                errors.bio &&
                  "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
              )}
              {...register("bio")}
            />
            {errors.bio && (
              <p role="alert" className="text-[12px] font-medium text-[#F04452]">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* 프로필 이미지 URL */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-photo-url">프로필 사진 URL (선택)</Label>
            <Input
              id="profile-photo-url"
              type="url"
              placeholder="https://example.com/avatar.png"
              aria-invalid={Boolean(errors.photoURL)}
              className={cn(
                errors.photoURL &&
                  "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15"
              )}
              {...register("photoURL")}
            />
            {errors.photoURL && (
              <p role="alert" className="text-[12px] font-medium text-[#F04452]">
                {errors.photoURL.message}
              </p>
            )}
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
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
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                "저장하기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
