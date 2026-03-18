import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-pdra focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-[4px]",
        outline: "shadow-inner-border bg-background hover:bg-surface text-foreground rounded-[4px]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-[4px]",
        ghost: "hover:bg-surface hover:text-foreground rounded-[4px]",
        link: "text-foreground underline-offset-4 hover:underline",
        pdra: "bg-foreground text-background hover:bg-foreground/90 rounded-[4px] tracking-wide uppercase text-xs font-medium active:scale-[0.99]",
        "pdra-outline": "shadow-inner-border bg-transparent text-foreground hover:bg-surface rounded-[4px] tracking-wide uppercase text-xs font-medium active:scale-[0.99]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        xl: "h-14 px-10 text-sm",
        icon: "h-10 w-10",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
