import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/forgot-password/forgot-password-form";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Reset Your Password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Studio Access"
      title="Forgot Password"
      description="Enter the email on your account and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
