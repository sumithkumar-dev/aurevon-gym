import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/reset-password/reset-password-form";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Set a New Password",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Studio Access"
      title="Set New Password"
      description="Choose a new password for your account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
