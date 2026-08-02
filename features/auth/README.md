# features/auth — reserved for Phase 2

Business logic for authentication, consumed by the route stubs at
`app/(app)/login/`. Planned sub-areas:

- `login` — sign-in form + server action
- `register` — sign-up form + server action
- `forgot-password` — request a reset link
- `reset-password` — set a new password from a reset token

Routes stay thin (`app/(app)/login/page.tsx` renders a component from
here); this folder owns the actual forms, server actions, and validation
wiring so route files don't accumulate business logic directly.
