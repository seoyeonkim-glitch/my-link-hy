"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <InputPrimitive
        type={type}
        className={cn(
          "flex h-[44px] w-full rounded-[12px] border border-[#E5E8EB] bg-[#F2F4F6]/70 px-3.5 py-2 text-[14px] font-normal text-[#191F28] placeholder:text-[#8B95A1] transition-all focus-visible:bg-white focus-visible:border-[#3182F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/15 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
