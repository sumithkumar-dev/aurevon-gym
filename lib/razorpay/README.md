# lib/razorpay

Server-only Razorpay (Test Mode) integration. Route handlers under
`app/api/razorpay/` stay thin and call into these helpers rather than
embedding Razorpay logic inline.

Implemented in Phase 2G:

- `client.ts` — `createRazorpayClient()`, a typed factory wrapping the
  SDK instance. The `razorpay` npm package ships no TypeScript types of
  its own (no `@types/razorpay` exists either) — `types/razorpay.d.ts`
  has a shorthand `declare module "razorpay";` to silence the resulting
  "cannot find declaration file" error, and this file immediately wraps
  the resulting `any` in an explicit `RazorpayClientLike` interface so
  nothing untyped leaks past it. Also exports `getRazorpayKeyId()` —
  `key_id` is not sensitive by Razorpay's own design and is returned to
  the client by the checkout route; `key_secret` never leaves this file.
- `orders.ts` — `createOrder()`, a thin wrapper around
  `razorpay.orders.create()`. No DB access here — that orchestration
  (reuse-or-create the pending membership, insert the payment row) lives
  in `features/payments/checkout/create-checkout-order.ts`, called from
  `app/api/razorpay/checkout/route.ts`.
- `webhooks.ts` — `verifyWebhookSignature()` (HMAC-SHA256 over the raw
  request body against `RAZORPAY_WEBHOOK_SECRET`, compared with
  `crypto.timingSafeEqual` rather than `===` so the comparison itself
  can't leak timing information) and `handleWebhookEvent()` (the actual
  `payment.captured`/`payment.failed` processing — membership
  activation, payment status updates — via the service-role client,
  since members have no insert/update policy on `memberships`/`payments`
  by design). Idempotent: a payment already in its target status is a
  no-op, since Razorpay retries webhook deliveries until it gets a 2xx.

Not implemented — deliberately out of this phase's scope:

- `verification.ts` (client-side checkout signature verification, i.e.
  validating the `razorpay_signature` the browser gets back from the
  Checkout.js `handler` callback) was planned here but has no caller:
  the webhook is the sole source of truth for activation (see
  `app/api/README.md`), and the client-side redirect in
  `features/payments/checkout/checkout-button.tsx` only shows a
  "payment received, confirming…" message — it never writes to the
  database. A `payments.razorpay_signature` column exists in the schema
  for this if a later phase wants faster UI feedback than waiting on the
  webhook, but nothing populates it yet.
- `invoice.ts` (invoice generation) — still deferred. Online payments
  activate a membership on `payment.captured` but do not yet create an
  `invoices` row, same scope boundary `features/admin/README.md` drew
  for offline payments in Phase 2F.
