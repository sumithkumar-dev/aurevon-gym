import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignupForm } from "@/features/auth/signup/signup-form";
import { AuthCard } from "@/features/auth/auth-card";
import { getCurrentProfile } from "@/lib/auth/session";
import { getPlanBySlug } from "@/lib/supabase/queries/plans";
import { roleHomeRoute } from "@/lib/constants/routes";
import { formatCurrency } from "@/features/memberships/status";

export const metadata: Metadata = {
  title: "Join",
};

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect(roleHomeRoute(profile.role));
  }

  const { plan: planSlug } = await searchParams;
  const plan = planSlug ? await getPlanBySlug(planSlug) : null;

  return (
    <AuthCard
      eyebrow="New Member"
      title="Create Your Account"
      description={
        plan
          ? `You're signing up for the ${plan.name} plan (${formatCurrency(plan.price_paise)}/month). Enter your details, then you'll pay securely online.`
          : "Enter your details below. You'll choose a plan and pay securely on the next step."
      }
    >
      <SignupForm plan={plan?.slug} />
    </AuthCard>
  );
}
