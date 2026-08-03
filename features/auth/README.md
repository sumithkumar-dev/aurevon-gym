# features/auth

Business logic for authentication. Routes stay thin
(`app/(app)/login/page.tsx` etc. render a component from here); this
folder owns the actual forms, Server Actions, and validation wiring.

Implemented in Phase 2C:

- `login` — `LoginForm` + `signInAction`. Redirects to `redirectTo` (set by
  `middleware.ts` when it bounced an unauthenticated visitor) or the
  user's role home.
- `forgot-password` — `ForgotPasswordForm` + `requestPasswordResetAction`.
  Always reports success regardless of whether the email is registered, to
  avoid user enumeration.
- `reset-password` — `ResetPasswordForm` + `resetPasswordAction`. Expects a
  recovery session already established by `app/api/auth/callback`.
- `sign-out` — `signOutAction`, used as a form action in
  `app/(app)/layout.tsx`'s header.
- `auth-card.tsx` — shared presentational wrapper for the three pages above.

No `register` sub-area: per the business rules, accounts are created only
after a verified Razorpay payment or by staff for a walk-in member (both via
`supabase.auth.admin.createUser` / `inviteUserByEmail` with the service-role
client, Phase 2F/2G) — there is no public self-signup form.
