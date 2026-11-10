"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Pencil, XCircle } from "lucide-react";
import { toast } from "sonner";
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
  displayName: z
    .string()
    .trim()
    .min(2, "표시 이름은 2자 이상 입력해 주세요.")
    .max(20, "표시 이름은 20자 이내로 입력해 주세요."),
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
  currentDisplayName: string;
  currentBio: string;
  currentPhotoURL: string;
  onCheckDisplayNameDuplicate: (displayName: string) => Promise<boolean>;
  onUpdateProfile: (values: {
    displayName: string;
    bio: string;
    photoURL: string;
  }) => Promise<void>;
}

type DuplicateCheckStatus =
  | "idle"
  | "checking"
  | "available"
  | "duplicate"
  | "unchanged";

export function EditProfileDialog({
  open,
  onOpenChange,
  currentDisplayName,
  currentBio,
  currentPhotoURL,
  onCheckDisplayNameDuplicate,
  onUpdateProfile,
}: EditProfileDialogProps) {
  const [checkStatus, setCheckStatus] =
    useState<DuplicateCheckStatus>("unchanged");
  const [checkedName, setCheckedName] = useState(currentDisplayName);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      displayName: currentDisplayName,
      bio: currentBio,
      photoURL: currentPhotoURL,
    },
    mode: "onTouched",
  });

  const watchedDisplayName = watch("displayName");

  // 모달이 열릴 때 현재 프로필 값으로 초기화
  useEffect(() => {
    if (open) {
      reset({
        displayName: currentDisplayName,
        bio: currentBio,
        photoURL: currentPhotoURL,
      });
      setCheckStatus("unchanged");
      setCheckedName(currentDisplayName);
    }
  }, [open, currentDisplayName, currentBio, currentPhotoURL, reset]);

  // 입력값이 변경되면 중복 확인 상태 갱신
  useEffect(() => {
    const trimmed = (watchedDisplayName ?? "").trim();
    if (trimmed === currentDisplayName.trim()) {
      setCheckStatus("unchanged");
    } else if (trimmed !== checkedName) {
      setCheckStatus("idle");
    }
  }, [watchedDisplayName, currentDisplayName, checkedName]);

  // 표시 이름(displayName) 중복 확인 핸들러
  const handleCheckDuplicate = async () => {
    const trimmed = (watchedDisplayName ?? "").trim();

    if (trimmed.length < 2) {
      setError("displayName", {
        type: "manual",
        message: "표시 이름은 2자 이상 입력해 주세요.",
      });
      return;
    }

    if (trimmed.length > 20) {
      setError("displayName", {
        type: "manual",
        message: "표시 이름은 20자 이내로 입력해 주세요.",
      });
      return;
    }

    if (trimmed === currentDisplayName.trim()) {
      clearErrors("displayName");
      setCheckStatus("unchanged");
      setCheckedName(trimmed);
      toast.success("현재 사용 중인 내 표시 이름이에요 ✓");
      return;
    }

    setCheckStatus("checking");
    try {
      const isDuplicate = await onCheckDisplayNameDuplicate(trimmed);
      setCheckedName(trimmed);

      if (isDuplicate) {
        setCheckStatus("duplicate");
        setError("displayName", {
          type: "manual",
          message: "이미 다른 사용자가 사용 중인 표시 이름이에요.",
        });
        toast.error("이미 사용 중인 표시 이름이에요.");
      } else {
        clearErrors("displayName");
        setCheckStatus("available");
        toast.success("사용 가능한 표시 이름이에요 ✓");
      }
    } catch {
      setCheckStatus("idle");
      toast.error("중복 확인 중 오류가 발생했어요. 다시 시도해 주세요.");
    }
  };

  const onSubmit = async (values: EditProfileFormValues) => {
    const trimmedName = values.displayName.trim();

    // 이름이 변경되었는데 아직 중복 확인을 안 했거나 중복 상태인 경우 검증
    if (trimmedName !== currentDisplayName.trim()) {
      if (checkStatus !== "available" || checkedName !== trimmedName) {
        setCheckStatus("checking");
        const isDuplicate = await onCheckDisplayNameDuplicate(trimmedName);
        setCheckedName(trimmedName);

        if (isDuplicate) {
          setCheckStatus("duplicate");
          setError("displayName", {
            type: "manual",
            message: "이미 다른 사용자가 사용 중인 표시 이름이에요.",
          });
          toast.error("이미 사용 중인 표시 이름이에요.");
          return;
        }
        setCheckStatus("available");
      }
    }

    await onUpdateProfile({
      displayName: trimmedName,
      bio: values.bio.trim(),
      photoURL: values.photoURL.trim(),
    });

    onOpenChange(false);
  };

  const isChecking = checkStatus === "checking";
  const isBusy = isSubmitting || isChecking;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <Pencil className="w-4 h-4 text-[#3182F6]" aria-hidden="true" />
            프로필 수정하기
          </DialogTitle>
          <DialogDescription>
            마이페이지에 표시될 이름과 한 줄 소개를 수정할 수 있어요.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-3.5"
        >
          {/* 표시 이름 (displayName) + 중복 확인 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-display-name">표시 이름 (Display Name) *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="profile-display-name"
                type="text"
                placeholder="표시할 이름을 입력해 주세요"
                aria-invalid={Boolean(errors.displayName)}
                className={cn(
                  "flex-1",
                  errors.displayName &&
                    "border-[#F04452] focus-visible:border-[#F04452] focus-visible:ring-[#F04452]/15",
                  checkStatus === "available" &&
                    !errors.displayName &&
                    "border-[#34C759] focus-visible:border-[#34C759]"
                )}
                {...register("displayName")}
              />
              <Button
                type="button"
                variant="secondary"
                disabled={
                  isBusy ||
                  !(watchedDisplayName ?? "").trim() ||
                  (watchedDisplayName ?? "").trim() === currentDisplayName.trim()
                }
                onClick={handleCheckDuplicate}
                className="h-[44px] px-3.5 rounded-[12px] text-[13px] font-bold shrink-0"
              >
                {isChecking ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  "중복 확인"
                )}
              </Button>
            </div>

            {errors.displayName ? (
              <p
                role="alert"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#F04452]"
              >
                <XCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {errors.displayName.message}
              </p>
            ) : checkStatus === "available" ? (
              <p className="inline-flex items-center gap-1 text-[12px] font-medium text-[#10B981]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                사용 가능한 표시 이름이에요.
              </p>
            ) : checkStatus === "unchanged" ? (
              <p className="text-[11.5px] text-[#8B95A1]">
                현재 사용 중인 표시 이름이에요. 변경 시 중복 확인을 진행해 주세요.
              </p>
            ) : (
              <p className="text-[11.5px] text-[#3182F6]">
                표시 이름을 변경한 후 [중복 확인] 버튼을 눌러주세요.
              </p>
            )}
          </div>

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
              disabled={isBusy}
              onClick={() => onOpenChange(false)}
              className="h-[46px] rounded-[12px] text-[14px] font-bold"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isBusy}
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
