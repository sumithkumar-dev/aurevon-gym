import { NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  handleWebhookEvent,
  type RazorpayWebhookEvent,
} from "@/lib/razorpay/webhooks";

// No Supabase session exists for this route — Razorpay calls it directly,
// server-to-server. Signature verification against RAZORPAY_WEBHOOK_SECRET
// is the entire authentication story here, which is why it happens before
// anything else, against the raw (unparsed) body.
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay:webhook] RAZORPAY_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    console.error("[razorpay:webhook] signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await handleWebhookEvent(event);

  // Always 200 once the signature checks out and the payload parses —
  // Razorpay retries non-2xx responses, and any processing failure past
  // this point is logged inside handleWebhookEvent for follow-up rather
  // than surfaced as a retryable HTTP error.
  return NextResponse.json({ ok: true });
}
