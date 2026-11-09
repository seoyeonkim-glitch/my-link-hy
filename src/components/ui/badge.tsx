import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full h-[30px] px-3 text-[13px] font-semibold tracking-normal transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-[#F2F4F6] text-[#4E5968]",
        brand: "bg-[#E8F3FF] text-[#3182F6]",
        secondary: "bg-[#F2F4F6] text-[#8B95A1]",
        outline: "border border-[#E5E8EB] bg-white text-[#4E5968]",
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
