import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
      className={cn(
        "min-h-32 w-full resize-none rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20",
        className,
      )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
