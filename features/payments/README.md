# features/payments

Business logic for the online checkout flow, consumed by
`app/api/razorpay/checkout/route.ts` and rendered on
`app/(app)/payments/page.tsx`.

Implemented in Phase 2G:

- `checkout/create-checkout-order.ts` — the actual orchestration.
  Validates the plan and the member's open-membership state using the
  normal session-scoped query modules (RLS already lets a member read
  their own membership and any active plan — no elevated privileges
  needed for reads), then creates the Razorpay order and writes the
  `pending` membership + `created` payment rows using the service-role
  client (members have no insert policy on `memberships`/`payments`, by
  design). Reusing an existing `pending` membership (same plan) rather
  than blocking is what makes "retry after an abandoned/failed payment"
  work without a separate resume flow; a mismatched-plan pending
  membership or an already-`active` one returns a clear error instead —
  same reuse-or-block logic as Phase 2F's offline flow, for the same
  reason (`memberships_one_open_per_member_idx` allows only one open
  membership per member).
- `checkout/checkout-button.tsx` — Razorpay Checkout.js integration
  (lazy-loads the script on click, not on page load). Its success
  `handler` is UX feedback only, never authoritative — see
  `lib/razorpay/README.md` on why the webhook, not this client redirect,
  activates the membership.
- `checkout/plan-picker.tsx` — one component for "no membership,"
  "pending," and "expired/cancelled" alike (all render the same active-
  plan grid); `create-checkout-order.ts`'s reuse-or-block logic is what
  makes picking any plan safe regardless of which of those states the
  member is actually in.

Not implemented — deliberately out of scope:

- Proration, discounts, or partial payments — checkout always charges
  exactly `plan.price_paise`.
- Automatic membership expiry — nothing in this codebase yet flips an
  `active` membership to `expired` once `end_date` passes (no scheduled
  job exists). A member whose membership has silently expired would
  still read as `active` here until that's built.
