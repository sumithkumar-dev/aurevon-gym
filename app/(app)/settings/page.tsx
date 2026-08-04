import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { ChangePasswordForm } from "@/features/member/settings/change-password-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requireRole(["member"]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Member Portal</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Settings
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Manage your account security.
      </p>

      <div className="mt-10">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
