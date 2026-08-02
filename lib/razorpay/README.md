# lib/razorpay — reserved for Phase 2

Not implemented yet (Test Mode integration planned). This folder holds:

- `client.ts` — server-side Razorpay SDK instance
- `orders.ts` — order creation helpers
- `verification.ts` — payment signature verification
- `webhooks.ts` — webhook signature verification + event handling
- `invoice.ts` — invoice generation helpers

Route handlers under `app/api/razorpay/` (checkout, webhooks) will call
into these helpers rather than embedding Razorpay logic inline.
