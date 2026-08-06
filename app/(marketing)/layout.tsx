import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentProfile } from "@/lib/auth/session";

// Public marketing site chrome (fixed-overlay Navbar + Footer). Split into
// its own route group so `app/(app)/*` (member portal, admin dashboard,
// auth) can use a distraction-free shell instead – see `app/(app)/layout.tsx`.
//
// Reads the current session (if any) so Navbar can swap "Sign In" for an
// account link when someone is already signed in, instead of always
// showing "Sign In" regardless of auth state.
export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar
        profile={profile ? { role: profile.role, full_name: profile.full_name } : null}
      />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
