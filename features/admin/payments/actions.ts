"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { STAFF_ROLES } from "@/lib/permissions/roles";
import { recordPaymentSchema } from "@/lib/validations/admin";
import { ROUTES } from "@/lib/constants/routes";

export type RecordPaymentState = { error?: string } | null;

// Maps the distinguishable `ERR_*` prefixes record_offline_payment() raises
// (see supabase/migrations/20260805000001_payment_atomicity_and_invoices.sql)
// to the same user-facing copy this action always showed — the validation
// rules themselves now live in one place (the database function) instead
// of being duplicated between it and this action.
const RPC_ERROR_MESSAGES: Record<string, string> = {
  ERR_INVALID_PLAN: "Select a valid, active plan.",
  ERR_ALREADY_ACTIVE: "This member already has an active membership.",
  ERR_PLAN_MISMATCH:
    "This member has a pending membership for a different plan. Resolve that before recording a new payment.",
  ERR_FORBIDDEN: "You don't have permission to record payments.",
};

function friendlyRpcError(message: string): string {
  const code = Object.keys(RPC_ERROR_MESSAGES).find((key) =>
    message.startsWith(key)
  );
  return code
    ? RPC_ERROR_MESSAGES[code]!
    : "Something went wrong recording this payment. Please try again.";
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

  const supabase = await createClient();

  // One transactional call: creates or activates the membership, inserts
  // the payment, and issues an invoice — see the migration comment for
  // why this moved out of separate insert/update calls made directly
  // from this action.
  const { data, error } = await supabase.rpc("record_offline_payment", {
    p_member_id: parsed.data.memberId,
    p_plan_id: parsed.data.planId,
    p_recorded_by: staff.id,
    p_notes: parsed.data.notes ?? null,
  });

  if (error) {
    console.error("[admin:payments] record_offline_payment failed", {
      staffId: staff.id,
      memberId: parsed.data.memberId,
      error: error.message,
    });
    return { error: friendlyRpcError(error.message) };
  }

  const result = data?.[0];
  console.info("[admin:payments] offline payment recorded", {
    staffId: staff.id,
    memberId: parsed.data.memberId,
    membershipId: result?.membership_id,
    paymentId: result?.payment_id,
    invoiceId: result?.invoice_id,
  });

  revalidatePath(ROUTES.adminPayments);
  revalidatePath(ROUTES.adminMembers);
  revalidatePath(ROUTES.admin);
  redirect(ROUTES.adminPayments);
}
