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
 * payment already `captured` is treated as a no-op success, not
 * re-processed. A prior `failed` status is deliberately NOT treated as
 * terminal here — Razorpay allows multiple payment attempts against the
 * same order, so a member whose first attempt failed and who
 * successfully retried needs their `payment.captured` event to still go
 * through. (`mark_payment_failed` similarly refuses to downgrade a
 * payment that's already `captured`, guarding the other ordering.)
 *
 * The actual reads/writes for each outcome happen inside
 * `activate_membership_from_payment()` / `mark_payment_failed()` — two
 * SECURITY DEFINER Postgres functions (see
 * `supabase/migrations/20260805000001_payment_atomicity_and_invoices.sql`)
 * that row-lock the payment and do their multi-table writes (membership +
 * payment + invoice, for a capture) as a single transaction, so a
 * delivery that fails partway through can never leave the data
 * half-updated or get double-applied by a retry.
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
    .select("id, status")
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

  if (event.event === "payment.failed") {
    const { data, error } = await admin.rpc("mark_payment_failed", {
      p_payment_id: paymentRow.id,
      p_razorpay_payment_id: payment.id,
    });

    if (error) {
      console.error("[razorpay:webhook] mark_payment_failed failed", {
        paymentId: paymentRow.id,
        error: error.message,
      });
      return;
    }

    console.info("[razorpay:webhook] payment marked failed", {
      paymentId: paymentRow.id,
      updated: data?.[0]?.updated ?? false,
    });
    return;
  }

  // payment.captured — activate the membership, capture the payment, and
  // issue the invoice atomically.
  const { data, error } = await admin.rpc("activate_membership_from_payment", {
    p_payment_id: paymentRow.id,
    p_razorpay_payment_id: payment.id,
  });

  if (error) {
    console.error("[razorpay:webhook] activate_membership_from_payment failed", {
      paymentId: paymentRow.id,
      error: error.message,
    });
    return;
  }

  const result = data?.[0];
  console.info(
    result?.already_captured
      ? "[razorpay:webhook] payment already captured (replayed delivery)"
      : "[razorpay:webhook] membership activated",
    {
      membershipId: result?.membership_id,
      paymentId: paymentRow.id,
      invoiceId: result?.invoice_id,
    }
  );
}
