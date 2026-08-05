import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/login/login-form";
import { AuthCard } from "@/features/auth/auth-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { roleHomeRoute } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect(roleHomeRoute(profile.role));
  }

  const { redirectTo } = await searchParams;

  return (
    <AuthCard
      eyebrow="Studio Access"
      title="Sign In"
      description="Members and staff both sign in here — you'll land in the right place for your account."
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
