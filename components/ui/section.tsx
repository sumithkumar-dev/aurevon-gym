import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  bleed?: boolean;
}

export function Section({
  className,
  as: Comp = "section",
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn("py-section", className)}
      {...props}
    >
      {bleed ? children : <div className="container-editorial">{children}</div>}
    </Comp>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-display-2 text-balance font-display uppercase leading-none">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-base md:text-lg text-muted leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
