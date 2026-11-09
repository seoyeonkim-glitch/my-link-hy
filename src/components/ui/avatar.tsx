"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#F2F4F6]",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, fallbackSrc, onError, alt = "", ...props }, ref) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={(e) => {
        if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
          e.currentTarget.src = fallbackSrc;
        }
        onError?.(e);
      }}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-[#F2F4F6] text-[18px] font-bold text-[#4E5968]",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
