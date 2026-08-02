"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Element/tag to render as. Defaults to a plain div. */
  as?: React.ElementType;
  /** Stagger delay in ms, applied via transition-delay. */
  delay?: number;
  /** Distance (px) the element travels in on reveal. */
  y?: number;
  /** Disable the effect entirely (renders children as-is). */
  disabled?: boolean;
}

/**
 * Scroll-reveal wrapper: fades + translates children up once they enter
 * the viewport. Respects prefers-reduced-motion (skips straight to the
 * visible state) and fails open if IntersectionObserver isn't available,
 * so content is never permanently stuck invisible.
 */
export function Reveal({
  as: Comp = "div",
  delay = 0,
  y = 16,
  disabled = false,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(disabled);

  React.useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [disabled]);

  return (
    <Comp
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-500 ease-editorial",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{
        transitionDelay: delay ? `${delay}ms` : undefined,
        transform: visible ? "translateY(0)" : `translateY(${y}px)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  );
}
