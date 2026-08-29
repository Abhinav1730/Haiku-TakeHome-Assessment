import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40 disabled:pointer-events-none disabled:opacity-50 min-h-12",
  {
    variants: {
      variant: {
        default: "bg-teal-800 text-white hover:bg-teal-900",
        secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
        outline: "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50",
        ghost: "text-stone-700 hover:bg-stone-100",
        choice:
          "w-full justify-start text-left border border-stone-200 bg-white px-4 py-4 hover:border-teal-700 hover:bg-teal-50/60 data-[selected=true]:border-teal-800 data-[selected=true]:bg-teal-50 data-[selected=true]:text-teal-950",
      },
      size: {
        default: "px-5 py-3",
        sm: "min-h-10 px-3 text-sm",
        lg: "min-h-14 px-6 text-lg",
        icon: "h-12 w-12 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";
