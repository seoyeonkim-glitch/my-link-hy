import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-[17px] font-bold tracking-[-0.005em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3182F6]/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:opacity-85",
        secondary:
          "bg-[#F2F4F6] text-[#191F28] hover:bg-[#E5E8EB] active:opacity-85",
        outline:
          "border border-[#E5E8EB] bg-white text-[#191F28] hover:bg-[#F2F4F6]",
        ghost:
          "bg-transparent text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]",
        link: "text-[#3182F6] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[52px] px-5 py-3",
        sm: "h-9 rounded-[12px] px-3.5 text-[14px] font-semibold",
        lg: "h-[56px] rounded-[16px] px-6 text-[18px]",
        icon: "h-[42px] w-[42px] rounded-[12px]",
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
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
