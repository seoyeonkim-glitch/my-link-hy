import * as React from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-[12.5px] font-semibold leading-none text-[#4E5968] select-none",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };
