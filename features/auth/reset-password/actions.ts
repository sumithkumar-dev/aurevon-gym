"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/lib/supabase/queries/profiles";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { roleHomeRoute } from "@/lib/constants/routes";

export type ResetPasswordState = { error?: string } | null;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error:
        "This reset link has expired or was already used. Please request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  const profile = await getProfileById(user.id);
  redirect(roleHomeRoute(profile?.role ?? "member"));
}
