"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Phase 2: wire to backend API / email service.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-accent-dim bg-surface p-8" role="status">
        <p className="font-display text-2xl uppercase">Message sent.</p>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Thank you for reaching out. A member of the studio team will
          respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Full name" name="name" type="text" autoComplete="name" required />
        <Field label="Email address" name="email" type="email" autoComplete="email" required />
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
          className="w-full resize-none border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus-visible:border-accent transition-colors"
          placeholder="Tell us a bit about your training goals."
        />
      </div>
      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
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
        className="w-full min-h-[3rem] border border-border bg-surface px-4 text-foreground placeholder:text-muted/60 focus-visible:border-accent transition-colors"
      />
    </div>
  );
}
