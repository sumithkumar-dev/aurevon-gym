# lib/validations

Zod schemas, usable both client-side (form validation) and server-side
(Server Action / route handler validation), defined once instead of
duplicated.

- `auth.ts` — implemented in Phase 2C: `loginSchema`, `forgotPasswordSchema`,
  `resetPasswordSchema`. No `registerSchema` — per the business rules,
  accounts are created only after a verified payment or by staff for a
  walk-in member, never via public self-signup.

Still planned, added alongside their owning phase:

- `member.ts` — profile / settings update schemas — Phase 2E
- `payments.ts` — checkout input schemas — Phase 2G
- `contact.ts` — contact form schema (shared between client + server once
  `contact-form.tsx` is wired to a real endpoint)
