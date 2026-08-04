import "server-only";
import Razorpay from "razorpay";

export interface RazorpayOrder {
  id: string;
  amount: number | string;
  currency: string;
}

export interface RazorpayClientLike {
  orders: {
    create(options: {
      amount: number;
      currency: string;
      receipt?: string;
      notes?: Record<string, string>;
    }): Promise<RazorpayOrder>;
  };
}

export function getRazorpayKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("Missing Razorpay configuration (RAZORPAY_KEY_ID).");
  }
  return keyId;
}

function getRazorpayKeySecret(): string {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("Missing Razorpay configuration (RAZORPAY_KEY_SECRET).");
  }
  return keySecret;
}

/**
 * Server-side Razorpay SDK instance. `key_secret` never leaves the
 * server — only `key_id` (not sensitive by Razorpay's own design) is
 * ever sent to the client, via the checkout route's JSON response.
 *
 * Typed as `RazorpayClientLike` rather than whatever the untyped
 * `razorpay` import resolves to (see `types/razorpay.d.ts`) — this is
 * the one place that boundary is crossed; every caller gets a properly
 * typed client.
 */
export function createRazorpayClient(): RazorpayClientLike {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
}
