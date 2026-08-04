import "server-only";
import { createRazorpayClient } from "./client";

export type CreatedOrder = {
  orderId: string;
  amountPaise: number;
  currency: string;
};

/**
 * Creates a Razorpay order for `amountPaise` (already the smallest
 * currency unit — paise — no conversion here). `receipt` should be
 * unique and short; Razorpay caps it at 40 characters (a UUID fits).
 *
 * Returns the `amountPaise`/currency we asked for rather than
 * round-tripping through the response body — the untyped SDK's
 * response shape isn't worth trusting for values the caller already
 * knows authoritatively.
 */
export async function createOrder({
  amountPaise,
  receipt,
  notes,
}: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<CreatedOrder> {
  const razorpay = createRazorpayClient();
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes,
  });

  return {
    orderId: order.id,
    amountPaise,
    currency: "INR",
  };
}
