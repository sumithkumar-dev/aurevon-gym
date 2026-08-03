# Aurevon Studios — Gym Membership Platform

Phase 1 (public marketing website) is stable and production-quality. Built
as the flagship template for Aurevon Studios, designed to be re-skinned
later for yoga studios, dance academies, martial arts academies, and other
membership-based businesses.

Phase 2 is underway: a real backend on Supabase. 2A (folder scaffolding),
2B (Supabase clients), 2C (authentication), and 2D (database schema) are
done — see `supabase/README.md` for the schema and `lib/auth/README.md` /
`lib/permissions/README.md` for how auth and roles work. Member Portal and
Admin Dashboard content (2E/2F) and Razorpay/email (2G/2H) are next.

## Stack

- **Next.js 15** (App Router), **TypeScript** (strict mode)
- **Tailwind CSS**, custom design tokens (no default theme colors used)
- **Radix UI primitives** (Accordion) — accessible interaction patterns
- **lucide-react** for icons
- **Supabase** (Postgres, Auth, RLS) — `@supabase/ssr`, `@supabase/supabase-js`
- **Zod** for shared client/server validation

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL/keys
npm run dev
```

Visit `http://localhost:3000`. Apply the database schema first — see
`supabase/README.md`.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Architecture

```
app/
  (marketing)/                       → Public site route group (own layout:
                                        Navbar + Footer). Same URLs as
                                        before — this is a file-location
                                        change only, not a redesign.
    page.tsx              → Homepage (assembles all sections in order)
    about/ membership/ trainers/ facilities/ gallery/ contact/ faq/
    privacy/ terms/
  (app)/                              → Auth + Member Portal + Admin
                                        Dashboard route group. Own layout
                                        (no marketing Navbar/Footer) —
                                        see app/(app)/layout.tsx.
    login/ forgot-password/ reset-password/   → implemented, Phase 2C
    member/ admin/    → minimal role-gated landing pages proving the auth
                         flow end-to-end; full dashboards are Phase 2E/2F
    profile/ payments/ settings/    → README.md only, still Phase 2E
  api/
    auth/callback/     → implemented, Phase 2C (Supabase Auth email links)
  not-found.tsx, icon.svg, robots.ts, sitemap.ts   → app-root special files
  layout.tsx            → html shell, fonts, JSON-LD only — chrome lives
                           in each route group's own layout

components/
  layout/    → Navbar, Footer (used by app/(marketing)/layout.tsx)
  sections/  → Homepage section components (Hero, Philosophy, etc.)
  ui/        → Reusable primitives: Button, Input, Label, Section,
               Placeholder, PricingCard/PricingGrid, Accordion,
               ContactForm, PageHeader, LegalPage

features/
  auth/          → implemented, Phase 2C: login, forgot-password,
                   reset-password, sign-out — see features/auth/README.md
  memberships/ payments/ member/ admin/   → still README-only, Phase 2E–2G

lib/
  site-data.ts     → Single source of truth for the public site's nav,
                     plans, trainers, testimonials, FAQ, contact info.
  seo.ts           → `pageMetadata()` for per-page Open Graph tags
  structured-data.ts → JSON-LD builder for the homepage
  utils.ts         → `cn()` class-merging helper
  supabase/        → implemented, Phase 2B: client.ts (browser),
                     server.ts, middleware.ts, admin.ts (service role),
                     database.types.ts, queries/profiles.ts
  auth/            → implemented, Phase 2C: session.ts, guards.ts
  permissions/     → implemented (roles.ts); can() deferred to Phase 2F
  constants/       → implemented (routes.ts); membership.ts/payments.ts
                     deferred to Phase 2E/2G
  validations/     → implemented (auth.ts); member.ts/payments.ts
                     deferred to their owning phases
  razorpay/        → RESERVED, Phase 2G
  email/           → RESERVED, Phase 2H

types/
  site.ts    → MembershipPlan, Trainer, Testimonial — the domain types
               shared by lib/site-data.ts and the components that render it

supabase/
  migrations/   → implemented, Phase 2D — 8 SQL migrations (schema + RLS),
                   see supabase/README.md

public/      → Static assets (currently empty; icon.svg lives in app/
               per Next.js's file-based icon convention)
```

### Why `(marketing)` and `(app)` are separate route groups

`app/(marketing)/` carries the fixed-overlay Navbar and full Footer, meant
for hero-driven public pages. `app/(app)/` — login and the future member
portal / admin dashboard — needed a distraction-free shell instead, so
Phase 2C split the root layout: `app/layout.tsx` now only owns the HTML
shell/fonts/JSON-LD, and each route group supplies its own chrome. This was
a pure file move (same URLs, same visuals for every public page) plus one
new minimal layout for `(app)/*`, not a redesign.

`/login`, `/member`, `/admin`, `/profile`, `/payments`, `/settings` stay
thin entry points that render components from the matching
`features/<domain>/` folder, which owns the actual business logic — this
keeps route files from accumulating logic directly as the app grows.

## Design system

- **Background** — near-black charcoal (`hsl(20 8% 6%)`)
- **Surface** — dark graphite (`hsl(20 7% 9%)` / `12%` raised)
- **Foreground** — warm off-white (`hsl(40 20% 94%)`)
- **Accent** — muted bronze (`hsl(30 42% 52%)`), used sparingly
- **Display type** — Bebas Neue (condensed, high-impact headings)
- **Body type** — Inter (geometric sans)

All tokens live in `app/globals.css` (CSS custom properties) and
`tailwind.config.ts` (scale, type, motion). Change the palette or type
scale from those two files only — no component hardcodes a color.

## Image & video placeholders

Every media slot uses the `<Placeholder>` component
(`components/ui/placeholder.tsx`). It preserves the exact aspect ratio
and layout footprint of its slot, so real photography/video can replace
it later with zero redesign. The Hero's cinematic area is built the same
way — swap its placeholder `<div>` for a `<video>` tag when ready.

## Phase 2 status

Done: 2A (folders), 2B (Supabase clients), 2C (auth: login, forgot/reset
password, session management, protected routes, role-based redirects), 2D
(database schema + RLS, 8 migrations, verified against a local Postgres
instance).

Not yet built:

- Member Portal / Admin Dashboard content (2E/2F) — `/member` and `/admin`
  currently only render a minimal role-gated confirmation page
- Razorpay checkout, webhooks, invoices (2G)
- Resend transactional email (2H)
- Trainer authentication — deferred past Phase 2 by design; `trainers` is
  a content table, not an account
- Self-service registration — not planned at all; accounts are created
  only after a verified payment or by staff for a walk-in member

The contact form currently only sets local UI state on submit — wire its
`handleSubmit` in `components/ui/contact-form.tsx` to a real endpoint
when the backend exists. Pricing card "Join Now" buttons are inert by
design per the brief; wiring them to Razorpay checkout is Phase 2G.
