import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export type RazorpayWebhookEvent = {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        amount: number;
        status: string;
      };
    };
  };
};

/**
 * Verifies the `x-razorpay-signature` header against the raw request
 * body using HMAC-SHA256 and the webhook secret — a separate secret from
 * the API key pair, configured when the webhook is created in the
 * Razorpay dashboard. Compares with `timingSafeEqual` rather than `===`
 * so the comparison itself can't leak timing information.
 *
 * `rawBody` must be the exact bytes Razorpay signed — read via
 * `request.text()` in the route handler, never `request.json()` then
 * re-stringified (re-serializing can subtly change the byte string and
 * cause false verification failures).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(signature, "hex");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/**
 * Processes a signature-verified webhook event — this, not the client's
 * post-payment redirect, is the source of truth for membership
 * activation (see `app/api/README.md`). Uses the service-role client:
 * members have no insert/update policy on `memberships`/`payments` by
 * design (see those migrations' own comments) — only a verified webhook
 * or a staff action can write them.
 *
 * Idempotent: Razorpay retries a webhook until it gets a 2xx, so a
 * payment already in its target status is treated as a no-op success,
 * not re-processed.
 */
export async function handleWebhookEvent(
  event: RazorpayWebhookEvent
): Promise<void> {
  const payment = event.payload.payment?.entity;
  if (!payment) {
    return;
  }

  if (event.event !== "payment.captured" && event.event !== "payment.failed") {
    // Out of scope for this phase (e.g. payment.authorized for
    // manual-capture flows, refund.*, order.paid) — acknowledged with a
    // 200 by the route handler either way, so Razorpay doesn't retry an
    // event we intentionally don't act on.
    return;
  }

  const admin = createAdminClient();
  const { data: paymentRow, error: fetchError } = await admin
    .from("payments")
    .select("id, membership_id, status")
    .eq("razorpay_order_id", payment.order_id)
    .maybeSingle();

  if (fetchError || !paymentRow) {
    console.error("[razorpay:webhook] payment row not found for order", {
      orderId: payment.order_id,
      event: event.event,
      error: fetchError?.message,
    });
    return;
  }

  if (paymentRow.status === "captured" || paymentRow.status === "failed") {
    // Already processed — a replayed delivery, not an error.
    return;
  }

  if (event.event === "payment.failed") {
    const { error: updateError } = await admin
      .from("payments")
      .update({ status: "failed", razorpay_payment_id: payment.id })
      .eq("id", paymentRow.id);

    if (updateError) {
      console.error("[razorpay:webhook] failed-payment update failed", {
        paymentId: paymentRow.id,
        error: updateError.message,
      });
      return;
    }

    console.info("[razorpay:webhook] payment marked failed", {
      paymentId: paymentRow.id,
    });
    return;
  }

  // payment.captured — activate the membership.
  const { data: membership, error: membershipFetchError } = await admin
    .from("memberships")
    .select("id, plan_id")
    .eq("id", paymentRow.membership_id)
    .maybeSingle();

  if (membershipFetchError || !membership) {
    console.error("[razorpay:webhook] membership not found for payment", {
      paymentId: paymentRow.id,
      membershipId: paymentRow.membership_id,
    });
    return;
  }

  const { data: plan, error: planFetchError } = await admin
    .from("membership_plans")
    .select("duration_days")
    .eq("id", membership.plan_id)
    .maybeSingle();

  if (planFetchError || !plan) {
    console.error("[razorpay:webhook] plan not found for membership", {
      membershipId: membership.id,
    });
    return;
  }

  const today = new Date();
  const startDate = today.toISOString().slice(0, 10);
  const endDateObj = new Date(today);
  endDateObj.setDate(endDateObj.getDate() + plan.duration_days);
  const endDate = endDateObj.toISOString().slice(0, 10);

  const { error: membershipUpdateError } = await admin
    .from("memberships")
    .update({ status: "active", start_date: startDate, end_date: endDate })
    .eq("id", membership.id);

  if (membershipUpdateError) {
    console.error("[razorpay:webhook] membership activation failed", {
      membershipId: membership.id,
      error: membershipUpdateError.message,
    });
    return;
  }

  const { error: paymentUpdateError } = await admin
    .from("payments")
    .update({ status: "captured", razorpay_payment_id: payment.id })
    .eq("id", paymentRow.id);

  if (paymentUpdateError) {
    console.error("[razorpay:webhook] payment-captured update failed", {
      paymentId: paymentRow.id,
      error: paymentUpdateError.message,
    });
    return;
  }

  console.info("[razorpay:webhook] membership activated", {
    membershipId: membership.id,
    paymentId: paymentRow.id,
  });
}
