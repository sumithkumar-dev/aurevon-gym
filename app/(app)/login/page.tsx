import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/login/login-form";
import { AuthCard } from "@/features/auth/auth-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { roleHomeRoute } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Member Login",
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
      eyebrow="Member Access"
      title="Sign In"
      description="Enter your credentials to access your membership."
    >
      <LoginForm redirectTo={redirectTo} />
    </AuthCard>
  );
}
