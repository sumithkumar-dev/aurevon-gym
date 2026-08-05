"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/supabase/queries/profiles";
import { loginSchema } from "@/lib/validations/auth";
import { roleHomeRoute } from "@/lib/constants/routes";

export type LoginActionState = {
  error?: string;
} | null;

export async function signInAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  const profile = await getProfileById(data.user.id);
  const redirectTo = formData.get("redirectTo");
  // Only accept same-origin, path-relative redirects. `//host` is
  // protocol-relative and browsers resolve it to an external origin, so it
  // must be rejected even though it passes a naive startsWith("/") check.
  const isSafeRedirect =
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//");

  redirect(isSafeRedirect ? redirectTo : roleHomeRoute(profile?.role ?? "member"));
}
