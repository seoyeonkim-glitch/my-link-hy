import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold tracking-normal transition-colors focus:outline-none select-none whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#F2F4F6] text-[#4E5968] h-[26px] px-2.5 text-[12px]",
        brand: "bg-[#E8F3FF] text-[#3182F6] h-[20px] px-2 text-[10.5px] font-bold",
        hot: "bg-[#FFEBEE] text-[#F04452] h-[20px] px-2 text-[10px] font-bold",
        new: "bg-[#E8F8F0] text-[#15803D] h-[20px] px-2 text-[10px] font-bold",
        count:
          "bg-[#E8F3FF] text-[#3182F6] h-[20px] min-w-[22px] px-1.5 text-[11px] font-bold",
        action:
          "bg-[#E8F3FF] text-[#3182F6] group-hover:bg-[#D0E7FF] h-[24px] sm:h-[26px] px-2.5 sm:px-3 text-[11px] sm:text-[12px] font-semibold",
        secondary: "bg-[#F2F4F6] text-[#8B95A1] h-[26px] px-2.5 text-[12px]",
        outline:
          "border border-[#E5E8EB] bg-white text-[#4E5968] h-[26px] px-2.5 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
