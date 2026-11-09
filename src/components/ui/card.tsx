import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white text-[#191F28] rounded-[24px] sm:rounded-[28px] border border-[#E5E8EB]/80 shadow-[0_8px_30px_rgba(25,31,40,0.04)] overflow-hidden",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardListRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group bg-[#F9FAFB]/70 hover:bg-[#F2F4F6]/80 active:scale-[0.99] border border-[#E5E8EB] rounded-[16px] sm:rounded-[18px] transition-all p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 text-[#191F28]",
      className
    )}
    {...props}
  />
));
CardListRow.displayName = "CardListRow";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[14px] sm:text-[15px] font-bold leading-snug tracking-[-0.01em] text-[#191F28] truncate",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[12px] sm:text-[12.5px] font-normal leading-relaxed text-[#6B7684] line-clamp-2 break-keep",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardListRow,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
