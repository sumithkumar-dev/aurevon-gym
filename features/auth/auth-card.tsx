import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-editorial flex min-h-[calc(100svh-5rem)] items-center justify-center py-16">
      <div className="w-full max-w-md border border-border bg-surface p-8 md:p-10">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-display-2 uppercase text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-sm text-muted">{description}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
