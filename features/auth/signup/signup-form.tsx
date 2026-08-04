"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type SignupActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SignupActionState = null;

export function SignupForm({ plan }: { plan?: string }) {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {plan && <input type="hidden" name="plan" value={plan} />}

      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          placeholder="Your full name"
        />
      </div>

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

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="98765 43210"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating your account…" : "Continue to Payment"}
      </Button>

      <p className="text-center text-xs text-muted">
        Already a member?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-accent"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
