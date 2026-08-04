"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { updateProfileSchema } from "@/lib/validations/member";
import { ROUTES } from "@/lib/constants/routes";

export type UpdateProfileState = { error?: string; success?: boolean } | null;

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  // Defense-in-depth: middleware and the page's own `requireRole` already
  // gate this route to signed-in members, but a Server Action is its own
  // callable endpoint, so it re-checks rather than trusting the caller.
  const profile = await requireRole(["member"]);

  const parsed = updateProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    date_of_birth: formData.get("date_of_birth"),
    gender: formData.get("gender"),
    address: formData.get("address"),
    emergency_contact_name: formData.get("emergency_contact_name"),
    emergency_contact_phone: formData.get("emergency_contact_phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone ?? null,
      date_of_birth: parsed.data.date_of_birth ?? null,
      gender: parsed.data.gender ?? null,
      address: parsed.data.address ?? null,
      emergency_contact_name: parsed.data.emergency_contact_name ?? null,
      emergency_contact_phone: parsed.data.emergency_contact_phone ?? null,
    })
    .eq("id", profile.id);

  if (error) {
    console.error("[member:profile] update failed", {
      memberId: profile.id,
      error: error.message,
    });
    return { error: "Something went wrong. Please try again." };
  }

  console.info("[member:profile] profile updated", { memberId: profile.id });

  revalidatePath(ROUTES.profile);
  revalidatePath(ROUTES.member);
  return { success: true };
}
