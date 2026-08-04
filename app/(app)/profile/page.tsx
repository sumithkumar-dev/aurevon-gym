import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { ProfileForm } from "@/features/member/profile/profile-form";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const profile = await requireRole(["member"]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Member Portal</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Profile
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Keep your contact and emergency information up to date.
      </p>

      <div className="mt-10">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
