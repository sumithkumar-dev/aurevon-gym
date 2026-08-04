"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { signupSchema } from "@/lib/validations/auth";
import { ROUTES } from "@/lib/constants/routes";

export type SignupActionState = { error?: string } | null;

// Never shown to the member and never stored anywhere by us — Supabase
// hashes it. If they need to sign in again later (e.g. next billing
// cycle) without ever having chosen a password, "Forgot password?" on
// /login uses Supabase Auth's own built-in reset email, which works today
// without the Resend integration (that's for receipts/invoices, Phase 2H).
function generateTempPassword() {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`;
}

export async function signUpAction(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const planField = formData.get("plan");
  const planSlug = typeof planField === "string" && planField ? planField : null;

  // Service-role client: this is the one path (besides staff walk-in
  // creation) allowed to create an auth user, per the business rules in
  // features/auth/README.md. email_confirm is set so the member can be
  // signed in immediately below — there's no email-sending step to wait on.
  const admin = createAdminClient();
  const password = generateTempPassword();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      role: "member",
    },
  });

  if (createError || !created.user) {
    const alreadyExists = createError?.message
      ?.toLowerCase()
      .includes("already");
    return {
      error: alreadyExists
        ? "An account with this email already exists. Try signing in instead."
        : "Something went wrong creating your account. Please try again.",
    };
  }

  // Sign in through the normal anon/session client (not the admin one) so
  // this writes real session cookies onto the response, the same way
  // signInAction does for a returning member.
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password,
  });

  if (signInError) {
    return {
      error:
        "Your account was created, but signing you in failed. Please try signing in from the login page.",
    };
  }

  redirect(planSlug ? `${ROUTES.payments}?plan=${planSlug}` : ROUTES.payments);
}
