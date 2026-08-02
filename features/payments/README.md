# features/payments — reserved for Phase 2

Business logic for checkout and payment history, consumed by the route
stub at `app/(app)/payments/`. Planned sub-areas:

- `checkout` — plan selection → Razorpay order creation → payment UI
- `history` — a member's past payments/invoices list

Calls into `lib/razorpay/` for the actual gateway integration; this
folder owns the UI and business rules (which plan, proration, etc.), not
the Razorpay SDK calls themselves.
