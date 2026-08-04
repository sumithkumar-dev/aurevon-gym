"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { changePasswordSchema } from "@/lib/validations/member";
import { ROUTES } from "@/lib/constants/routes";

export type ChangePasswordState = { error?: string; success?: boolean } | null;

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const profile = await requireRole(["member"]);

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();

  // Re-verify the current password before allowing a change. An active
  // session alone isn't proof the person at the keyboard is the account
  // owner (e.g. an unattended, still-logged-in device) — unlike
  // reset-password, which starts from a fresh recovery link, this flow
  // starts from an ordinary session, so it re-checks the password itself.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: parsed.data.currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    console.error("[member:settings] password change failed", {
      memberId: profile.id,
      error: error.message,
    });
    return { error: error.message };
  }

  console.info("[member:settings] password changed", { memberId: profile.id });

  revalidatePath(ROUTES.settings);
  return { success: true };
}
