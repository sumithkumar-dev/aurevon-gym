import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-medium uppercase tracking-wide text-sm transition-all duration-300 ease-editorial disabled:pointer-events-none disabled:opacity-40 cursor-pointer active:scale-[0.97] active:duration-150",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-background hover:bg-accent-bright min-h-[3rem] px-8",
        outline:
          "border border-foreground/30 text-foreground hover:border-accent hover:text-accent min-h-[3rem] px-8",
        ghost:
          "text-foreground hover:text-accent min-h-[3rem] px-2 underline underline-offset-8 decoration-border hover:decoration-accent",
      },
      size: {
        default: "text-sm",
        lg: "text-base px-10",
      },
    },
    defaultVariants: {
      variant: "primary",
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
