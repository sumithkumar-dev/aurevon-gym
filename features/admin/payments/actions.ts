"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { recordPaymentSchema } from "@/lib/validations/admin";
import { getOpenMembershipForMember } from "@/lib/supabase/queries/memberships";
import { getPlanById } from "@/lib/supabase/queries/plans";
import { ROUTES } from "@/lib/constants/routes";

export type RecordPaymentState = { error?: string } | null;

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
}

export async function recordPaymentAction(
  _prevState: RecordPaymentState,
  formData: FormData
): Promise<RecordPaymentState> {
  const staff = await requireRole(STAFF_ROLES);

  const parsed = recordPaymentSchema.safeParse({
    memberId: formData.get("memberId"),
    planId: formData.get("planId"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const plan = await getPlanById(parsed.data.planId);
  if (!plan || !plan.is_active) {
    return { error: "Select a valid, active plan." };
  }

  const supabase = await createClient();
  const openMembership = await getOpenMembershipForMember(
    parsed.data.memberId
  );

  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  const endDate = addDays(today, plan.duration_days);

  let membershipId: string;

  if (openMembership) {
    // Only one pending/active membership is allowed per member
    // (`memberships_one_open_per_member_idx`) — renewals and plan
    // switches for an already-active membership aren't handled by this
    // MVP flow, so surface a clear error instead of a raw constraint
    // violation.
    if (openMembership.status === "active") {
      return { error: "This member already has an active membership." };
    }
    if (openMembership.plan_id !== plan.id) {
      return {
        error:
          "This member has a pending membership for a different plan. Resolve that before recording a new payment.",
      };
    }

    const { error: updateError } = await supabase
      .from("memberships")
      .update({ status: "active", start_date: startDate, end_date: endDate })
      .eq("id", openMembership.id);

    if (updateError) {
      console.error("[admin:payments] membership activation failed", {
        staffId: staff.id,
        membershipId: openMembership.id,
        error: updateError.message,
      });
      return { error: "Something went wrong activating the membership." };
    }
    membershipId = openMembership.id;
  } else {
    const newMembershipId = crypto.randomUUID();
    const { error: createError } = await supabase.from("memberships").insert({
      id: newMembershipId,
      member_id: parsed.data.memberId,
      plan_id: plan.id,
      status: "active",
      start_date: startDate,
      end_date: endDate,
      created_by: staff.id,
    });

    if (createError) {
      console.error("[admin:payments] membership creation failed", {
        staffId: staff.id,
        memberId: parsed.data.memberId,
        error: createError.message,
      });
      return { error: "Something went wrong creating the membership." };
    }
    membershipId = newMembershipId;
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    membership_id: membershipId,
    member_id: parsed.data.memberId,
    plan_id: plan.id,
    amount_paise: plan.price_paise,
    method: "offline",
    status: "captured",
    recorded_by: staff.id,
    notes: parsed.data.notes ?? null,
  });

  if (paymentError) {
    console.error("[admin:payments] payment record failed", {
      staffId: staff.id,
      membershipId,
      error: paymentError.message,
    });
    return {
      error:
        "The membership was updated, but recording the payment failed. Please try again.",
    };
  }

  console.info("[admin:payments] offline payment recorded", {
    staffId: staff.id,
    memberId: parsed.data.memberId,
    membershipId,
    amountPaise: plan.price_paise,
  });

  revalidatePath(ROUTES.adminPayments);
  revalidatePath(ROUTES.adminMembers);
  revalidatePath(ROUTES.admin);
  redirect(ROUTES.adminPayments);
}
