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
- `auth-card.tsx` — shared presentational wrapper for the pages above.
- `signup` — `SignupForm` + `signUpAction`, rendered at `/join`. Public
  self-signup, added so the marketing pricing cards' "Join Now" button
  (`?plan=<slug>`) has somewhere real to go: collects name/email/phone,
  creates the auth user via `supabase.auth.admin.createUser` (service-role
  client, `email_confirm: true` so no email round-trip is needed), then
  signs the member in immediately with a generated password they never
  see and redirects to `/payments?plan=<slug>` to pay. If they ever need
  to sign in again without having set a password themselves, "Forgot
  password?" on `/login` uses Supabase Auth's own reset email — that
  works today independent of the Resend integration (Phase 2H).

The "accounts are created only after a verified payment or by staff for a
walk-in member" business rule still holds — `signUpAction` is that
"verified payment" path's entry point (account first, payment immediately
next via the existing checkout flow), not a way to get an account without
paying.
