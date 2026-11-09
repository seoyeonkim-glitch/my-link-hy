"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group rounded-full bg-[#191F28]/95 text-white border-none px-4 py-2.5 text-[13.5px] font-semibold shadow-[0_12px_32px_rgba(25,31,40,0.22)] flex items-center gap-2",
          title: "text-[13.5px] font-semibold text-white",
          description: "text-[12px] text-[#B0B8C1]",
          success: "text-white",
          error: "bg-[#F04452] text-white",
        },
      }}
      {...props}
    />
  );
}
