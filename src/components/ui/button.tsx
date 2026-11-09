"use client";

import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-[15px] font-bold tracking-[-0.005em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:opacity-85",
        destructive:
          "bg-[#F04452] text-white hover:bg-[#D93845] active:opacity-85",
        secondary:
          "bg-[#F2F4F6] text-[#191F28] hover:bg-[#E5E8EB] active:opacity-85",
        iconCircle:
          "rounded-full bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB] hover:text-[#191F28] border border-[#E5E8EB]/60",
        outline:
          "border border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F2F4F6]",
        ghost:
          "bg-transparent text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]",
        link: "text-[#3182F6] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[48px] px-5 py-2.5",
        sm: "h-8 rounded-[10px] px-3 text-[13px] font-semibold",
        lg: "h-[52px] rounded-[14px] px-6 text-[17px]",
        icon: "h-10 w-10 rounded-full p-0",
        iconSm: "h-9 w-9 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
