"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type LoginActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginActionState = null;

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted underline underline-offset-4 hover:text-accent"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing In…" : "Sign In"}
      </Button>

      <p className="text-center text-xs text-muted">
        New here?{" "}
        <Link
          href="/join"
          className="underline underline-offset-4 hover:text-accent"
        >
          Join now
        </Link>
      </p>
    </form>
  );
}
