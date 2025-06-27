import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white dark:bg-gray-800 text-black dark:text-white border-slate-200 dark:border-gray-600 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500 dark:text-gray-300",

        // custom
        locked:
          "bg-neutral-200 dark:bg-neutral-700 text-primary-foreground hover:bg-neutral-200/90 dark:hover:bg-neutral-600/90 border-neutral-400 dark:border-neutral-500 border-b-4 active:border-b-0",

        primary:
          "bg-sky-400 text-primary-foreground hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
        primaryOutline: "bg-white dark:bg-gray-800 text-sky-500 dark:text-sky-400 hover:bg-slate-100 dark:hover:bg-gray-700",

        secondary:
          "bg-[#a259ff] text-primary-foreground hover:bg-[#a259ff]/90 border-[#a259ff] border-b-4 active:border-b-0 shadow-[0_0_8px_#a259ff] hover:shadow-[0_0_12px_#a259ff]",
        secondaryOutline: "bg-white dark:bg-gray-800 text-[#a259ff] dark:text-[#c084ff] hover:bg-slate-100 dark:hover:bg-gray-700",

        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
        dangerOutline: "bg-white dark:bg-gray-800 text-rose-500 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-gray-700",

        super:
          "bg-indigo-500 text-primary-foreground hover:bg-indigo-500/90 border-indigo-600 border-b-4 active:border-b-0",
        superOutline: "bg-white dark:bg-gray-800 text-indigo-500 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-700",

        ghost:
          "bg-transparent text-slate-500 dark:text-gray-400 border-transparent border-0 hover:bg-slate-100 dark:hover:bg-gray-800",

        sidebar:
          "bg-transparent text-slate-500 dark:text-gray-400 border-2 border-transparent hover:bg-slate-100 dark:hover:bg-gray-800 transition-none",
        sidebarOutline:
          "bg-sky-500/15 dark:bg-sky-500/20 text-sky-500 dark:text-sky-400 border-sky-300 dark:border-sky-600 border-2 hover:bg-sky-500/20 dark:hover:bg-sky-500/30 transition-none",

        neonPurple:
          "bg-[hsl(270,100%,60%)] text-white border-[hsl(270,100%,60%)] border-b-4 active:border-b-0 shadow-[0_0_8px_#a259ff,0_0_16px_#a259ff] hover:bg-[hsl(270,100%,70%)] transition-all duration-200",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",

        // custom
        rounded: "rounded-full",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
