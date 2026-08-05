"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordResetAction,
  type ForgotPasswordState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ForgotPasswordState = null;

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState
  );

  if (state?.success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-foreground">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password.
        </p>
        <Link
          href="/login"
          className="text-sm text-muted underline underline-offset-4 hover:text-accent"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Sending…" : "Send Reset Link"}
      </Button>

      <Link
        href="/login"
        className="text-center text-sm text-muted underline underline-offset-4 hover:text-accent"
      >
        Back to sign in
      </Link>
    </form>
  );
}
