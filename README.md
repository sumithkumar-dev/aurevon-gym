# Aurevon Studios — Gym Membership Platform

Phase 1: the public marketing website. Built as the flagship template for
Aurevon Studios, designed to be re-skinned later for yoga studios, dance
academies, martial arts academies, and other membership-based businesses.

## Stack

- **Next.js 15** (App Router), **TypeScript** (strict mode)
- **Tailwind CSS**, custom design tokens (no default theme colors used)
- **Radix UI primitives** (Accordion) — accessible interaction patterns
- **lucide-react** for icons

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Architecture

```
app/
  page.tsx              → Homepage (assembles all sections in order)
  about/                → About
  membership/            → Membership Plans
  trainers/              → Trainers
  facilities/             → Facilities
  gallery/                 → Gallery
  contact/                  → Contact
  faq/                       → FAQ
  privacy/                     → Privacy Policy
  terms/                         → Terms
  not-found.tsx                    → 404
  icon.svg                          → Favicon (bronze monogram, brand tokens)
  robots.ts                         → robots.txt (generated)
  sitemap.ts                        → sitemap.xml (generated)
  (app)/                             → RESERVED, Phase 2 route group
    login/ member/ admin/ profile/ payments/ settings/
    (each has a README.md only — no pages implemented yet, each links
    to its corresponding features/ folder below)

components/
  layout/    → Navbar, Footer
  sections/  → Homepage section components (Hero, Philosophy, etc.),
               reused by interior pages where relevant
  ui/        → Reusable primitives: Button, Section, Placeholder,
               PricingCard/PricingGrid, Accordion, ContactForm,
               PageHeader, LegalPage

features/    → RESERVED, Phase 2. Business logic for domains with
               planned backend work: auth/ memberships/ payments/
               member/ admin/ — each has a README describing its
               planned sub-areas. (Trainers/gallery/contact are
               intentionally NOT here — they're already fully built
               as static presentational features under
               components/sections/, with no described backend work
               of their own.)

lib/
  site-data.ts   → Single source of truth for nav, plans, trainers,
                   testimonials, FAQ, and studio contact info.
                   Swap this for a CMS/DB call in Phase 2 without
                   touching any component.
  seo.ts         → `pageMetadata()` — ensures each page's Open Graph
                   tags match its own title/description rather than
                   inheriting the homepage's.
  utils.ts       → `cn()` class-merging helper
  supabase/      → RESERVED, Phase 2 (client/server/middleware/types/queries)
  razorpay/      → RESERVED, Phase 2 (orders/verification/webhooks/invoice)
  auth/          → RESERVED, Phase 2 (session/guards; root middleware.ts
                   is added alongside this, not before)
  email/         → RESERVED, Phase 2 (Resend client/templates/send)
  validations/   → RESERVED, Phase 2 (shared client+server schemas)

types/
  site.ts    → MembershipPlan, Trainer, Testimonial — the domain types
               shared by lib/site-data.ts and the components that render it

public/      → Static assets (currently empty; icon.svg lives in app/
               per Next.js's file-based icon convention)
```

### Why the `(app)` route group and `features/`

`/login`, `/member`, `/admin`, `/profile`, `/payments`, `/settings` are
reserved as an unimplemented route group so Phase 2 (auth, member portal,
admin dashboard, Supabase, Razorpay) can be added without restructuring
any public route or shared layout. Each of those routes will stay a thin
entry point that renders components from the matching `features/<domain>/`
folder, which owns the actual business logic — this keeps route files
from accumulating logic directly as the app grows.

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

## What's intentionally NOT built (Phase 2)

- Member Portal, Admin Dashboard
- Authentication
- Supabase / database
- Razorpay / payments
- Any backend API

The contact form currently only sets local UI state on submit — wire its
`handleSubmit` in `components/ui/contact-form.tsx` to a real endpoint
when the backend exists. Pricing card "Join Now" buttons are inert by
design per the brief.
