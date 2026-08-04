import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOpenMembershipForMember } from "@/lib/supabase/queries/memberships";
import { getPlanById } from "@/lib/supabase/queries/plans";
import { createOrder } from "@/lib/razorpay/orders";
import { getRazorpayKeyId } from "@/lib/razorpay/client";

export type CreateCheckoutOrderResult =
  | {
      ok: true;
      orderId: string;
      amountPaise: number;
      currency: string;
      keyId: string;
      planName: string;
    }
  | { ok: false; error: string };

export async function createCheckoutOrder({
  memberId,
  planId,
}: {
  memberId: string;
  planId: string;
}): Promise<CreateCheckoutOrderResult> {
  // Reads go through the normal session-scoped query modules — RLS
  // already lets a member read their own membership and any active plan,
  // so no elevated privileges are needed for these checks.
  const plan = await getPlanById(planId);
  if (!plan || !plan.is_active) {
    return { ok: false, error: "Select a valid, active plan." };
  }

  const openMembership = await getOpenMembershipForMember(memberId);
  if (openMembership) {
    if (openMembership.status === "active") {
      return { ok: false, error: "You already have an active membership." };
    }
    if (openMembership.plan_id !== plan.id) {
      return {
        ok: false,
        error:
          "You have a pending payment for a different plan. Complete or wait for that to expire before starting a new one.",
      };
    }
    // Same plan, still pending — falls through to reuse this membership
    // and create a fresh order, so retrying after a failed/abandoned
    // payment doesn't need a separate "resume" flow.
  }

  // From here on, every write needs the service-role client — members
  // have no insert/update policy on `memberships`/`payments` (see those
  // migrations' own comments); creation happens only via this verified,
  // server-only checkout/webhook path or a staff action.
  const membershipId = openMembership?.id ?? crypto.randomUUID();
  const paymentId = crypto.randomUUID();

  let order;
  try {
    order = await createOrder({
      amountPaise: plan.price_paise,
      receipt: paymentId,
      notes: { memberId, planId: plan.id, membershipId },
    });
  } catch (error) {
    console.error("[payments:checkout] razorpay order creation failed", {
      memberId,
      planId: plan.id,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      ok: false,
      error: "Something went wrong starting checkout. Please try again.",
    };
  }

  const admin = createAdminClient();

  if (!openMembership) {
    const { error: membershipError } = await admin.from("memberships").insert({
      id: membershipId,
      member_id: memberId,
      plan_id: plan.id,
      status: "pending",
    });

    if (membershipError) {
      console.error("[payments:checkout] membership creation failed", {
        memberId,
        planId: plan.id,
        error: membershipError.message,
      });
      return {
        ok: false,
        error: "Something went wrong starting checkout. Please try again.",
      };
    }
  }

  const { error: paymentError } = await admin.from("payments").insert({
    id: paymentId,
    membership_id: membershipId,
    member_id: memberId,
    plan_id: plan.id,
    amount_paise: plan.price_paise,
    currency: "INR",
    method: "online",
    status: "created",
    razorpay_order_id: order.orderId,
  });

  if (paymentError) {
    console.error("[payments:checkout] payment record creation failed", {
      memberId,
      membershipId,
      error: paymentError.message,
    });
    return {
      ok: false,
      error: "Something went wrong starting checkout. Please try again.",
    };
  }

  console.info("[payments:checkout] order created", {
    memberId,
    membershipId,
    planId: plan.id,
    orderId: order.orderId,
  });

  return {
    ok: true,
    orderId: order.orderId,
    amountPaise: order.amountPaise,
    currency: order.currency,
    keyId: getRazorpayKeyId(),
    planName: plan.name,
  };
}
