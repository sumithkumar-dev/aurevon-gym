"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { memberStatusSchema } from "@/lib/validations/admin";
import { ROUTES } from "@/lib/constants/routes";

export type MemberStatusState = { error?: string } | null;

export async function updateMemberStatusAction(
  memberId: string,
  _prevState: MemberStatusState,
  formData: FormData
): Promise<MemberStatusState> {
  // Only Owner/Manager may change a profile's status — mirrors
  // `profiles_update_own_or_staff` RLS and the `prevent_unauthorized_role_change`
  // trigger, which would reject this write for a Receptionist anyway.
  const staff = await requireRole(["owner", "manager"]);

  const parsed = memberStatusSchema.safeParse({
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status: parsed.data.status })
    .eq("id", memberId)
    .eq("role", "member");

  if (error) {
    console.error("[admin:members] status update failed", {
      staffId: staff.id,
      memberId,
      error: error.message,
    });
    return { error: "Something went wrong. Please try again." };
  }

  console.info("[admin:members] member status updated", {
    staffId: staff.id,
    memberId,
    status: parsed.data.status,
  });

  revalidatePath(`${ROUTES.adminMembers}/${memberId}`);
  revalidatePath(ROUTES.adminMembers);
  return null;
}
