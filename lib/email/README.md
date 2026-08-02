# lib/email — reserved for Phase 2

Not connected yet (Resend planned). This folder holds:

- `client.ts` — Resend SDK instance
- `templates/` — React Email templates (welcome, receipt, password reset,
  membership freeze/cancellation confirmations)
- `send.ts` — typed wrapper functions per email type, so features call
  `sendWelcomeEmail(user)` rather than building emails inline

The contact form (`components/ui/contact-form.tsx`) will call into this
folder once a backend exists — see its `handleSubmit` for the current
Phase 1 placeholder behavior.
