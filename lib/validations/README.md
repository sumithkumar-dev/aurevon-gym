# lib/validations — reserved for Phase 2

Not implemented yet. This folder will hold schema definitions (Zod is a
reasonable default choice, but not yet installed — no need to add the
dependency before there's a form to validate against a backend):

- `auth.ts` — login / register / password reset schemas
- `contact.ts` — contact form schema (shared between client + server once
  `contact-form.tsx` is wired to a real endpoint)
- `member.ts` — profile / settings update schemas
- `payments.ts` — checkout input schemas

Each schema should be usable both client-side (form validation) and
server-side (route handler / server action validation), so it's defined
once here rather than duplicated.
