"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DeleteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkTitle: string;
  onConfirmDelete: () => Promise<void> | void;
}

export function DeleteLinkDialog({
  open,
  onOpenChange,
  linkTitle,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px]">
        <DialogHeader className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF0F1] text-[#F04452] shrink-0">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            </span>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          </div>
          <DialogDescription className="text-[13px] font-semibold text-[#F04452]">
            이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 삭제 대상 링크 이름 표시 */}
        <div className="rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] px-3.5 py-2.5 mb-2">
          <p className="text-[11.5px] font-medium text-[#8B95A1] mb-0.5">
            삭제할 링크
          </p>
          <p className="text-[14px] font-bold text-[#191F28] break-all">
            {linkTitle}
          </p>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2 pt-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="h-[46px] rounded-[12px] text-[14px] font-bold"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="h-[46px] rounded-[12px] text-[14px] font-bold"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                삭제 중...
              </>
            ) : (
              "삭제하기"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
