import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Member Dashboard",
};

export default async function MemberPage() {
  const profile = await requireRole(["member"]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Member Portal</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Welcome, {profile.full_name || "Member"}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Membership status, expiry date, payment history, invoices, profile,
        and announcements land here in Phase 2E. This page confirms sign-in,
        session persistence, and role-based routing are working end to end.
      </p>
    </div>
  );
}
