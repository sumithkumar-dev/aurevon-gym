import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Public marketing site chrome (fixed-overlay Navbar + Footer). Split into
// its own route group so `app/(app)/*` (member portal, admin dashboard,
// auth) can use a distraction-free shell instead — see `app/(app)/layout.tsx`.
// This is a structural move only: no routes, styling, or content changed.
export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
