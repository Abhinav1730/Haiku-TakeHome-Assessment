import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-14 w-full rounded-2xl border border-stone-300 bg-white px-4 text-lg outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
