"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  visible?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, visible = false, children, ...props }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 max-w-[90vw] whitespace-nowrap inline-flex items-center gap-2 rounded-full bg-[#191F28]/95 px-4 py-2.5 text-[13px] sm:text-[14px] font-semibold text-white shadow-lg transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Toast.displayName = "Toast";

export { Toast };
