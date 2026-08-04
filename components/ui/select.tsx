import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "min-h-[3rem] w-full border border-border bg-surface px-4 font-body text-foreground transition-colors duration-300 ease-editorial focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

export { Select };
