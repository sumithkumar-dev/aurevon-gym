# lib/validations

Zod schemas, usable both client-side (form validation) and server-side
(Server Action / route handler validation), defined once instead of
duplicated.

- `auth.ts` — implemented in Phase 2C: `loginSchema`, `forgotPasswordSchema`,
  `resetPasswordSchema`. No `registerSchema` — per the business rules,
  accounts are created only after a verified payment or by staff for a
  walk-in member, never via public self-signup.
- `member.ts` — implemented in Phase 2E: `updateProfileSchema` (backs
  `features/member/profile`) and `changePasswordSchema` (backs
  `features/member/settings`).
- `admin.ts` — implemented in Phase 2F: `memberStatusSchema`, `planSchema`
  (rupees in the form, converted to `price_paise` in the action), and
  `recordPaymentSchema` (the offline payment-recording flow).
- `payments.ts` — implemented in Phase 2G: `checkoutRequestSchema`
  (just `{ planId }` — everything else about the checkout order is
  derived server-side from the authenticated caller and the plan row,
  never trusted from the client).

Still planned, added alongside their owning phase:

- `payments.ts` — checkout input schemas — Phase 2G
- `contact.ts` — contact form schema (shared between client + server once
  `contact-form.tsx` is wired to a real endpoint)
