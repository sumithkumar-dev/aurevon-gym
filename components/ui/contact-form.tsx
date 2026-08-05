"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { membershipPlans } from "@/lib/site-data";

type Status = "idle" | "submitting" | "success";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (!name) errors.name = "Please enter your name.";
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!message) errors.message = "Please add a short message.";

  return errors;
}

function ContactFormBase({ defaultMessage }: { defaultMessage?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [errors]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nextErrors = validate(data);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    // Phase 2: wire to backend API / email service. The simulated delay
    // keeps the interaction feeling real until that's connected.
    window.setTimeout(() => setStatus("success"), 700);
  }

  if (status === "success") {
    return (
      <div
        className="border border-accent-dim bg-surface p-8 opacity-0"
        style={{
          animation: "fade-up 400ms cubic-bezier(0.16,1,0.3,1) forwards",
        }}
        role="status"
      >
        <p className="font-display text-2xl uppercase">Message sent.</p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Thank you for reaching out. A member of the studio team will
          respond within one business day.
        </p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      <p
        role="alert"
        aria-live="polite"
        className={cn(
          "text-sm text-destructive overflow-hidden transition-all duration-300 ease-editorial",
          hasErrors
            ? "max-h-10 translate-y-0 opacity-100"
            : "max-h-0 -translate-y-1 opacity-0"
        )}
      >
        {hasErrors ? "Please fix the highlighted fields below." : ""}
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs uppercase tracking-wide text-muted"
        >
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(
            "w-full resize-none border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 transition-colors hover:border-foreground/40 focus-visible:border-accent",
            errors.message ? "border-destructive-strong/70" : "border-border"
          )}
          placeholder="Tell us a bit about your training goals."
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-xs text-destructive">
            {errors.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "submitting"}
        className="w-full sm:w-auto"
      >
        {status === "submitting" && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function ContactFormWithPlan() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const plan = planId
    ? membershipPlans.find((p) => p.id === planId)
    : undefined;
  const defaultMessage = plan
    ? `I'm interested in the ${plan.name} membership.`
    : undefined;

  return <ContactFormBase defaultMessage={defaultMessage} />;
}

export function ContactForm() {
  return (
    <Suspense fallback={<ContactFormBase />}>
      <ContactFormWithPlan />
    </Suspense>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  error,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-wide text-muted">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cn(
          "w-full min-h-[3rem] border bg-surface px-4 text-foreground placeholder:text-muted/60 transition-colors hover:border-foreground/40 focus-visible:border-accent",
          error ? "border-destructive-strong/70" : "border-border"
        )}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
