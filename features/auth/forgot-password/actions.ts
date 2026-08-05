"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { SITE_URL } from "@/lib/constants/site-url";

export type ForgotPasswordState = { success?: boolean; error?: string } | null;

export async function requestPasswordResetAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  // Prefer the request's own Origin (correct for preview/staging
  // deployments and localhost); NEXT_PUBLIC_SITE_URL — via the shared
  // SITE_URL constant, which always has a value — is the fallback for
  // server contexts with no reliable Origin header. Previously fell back
  // to `process.env.NEXT_PUBLIC_SITE_URL` directly, which is `undefined`
  // if that var isn't set, producing a broken "undefined/api/auth/..."
  // reset link.
  const origin = (await headers()).get("origin") ?? SITE_URL;

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(
      "/reset-password"
    )}`,
  });

  // Always report success, whether or not the email is registered — this
  // avoids leaking which emails have accounts (user enumeration).
  return { success: true };
}
