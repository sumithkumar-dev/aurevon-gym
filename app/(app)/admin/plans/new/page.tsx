import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { PlanForm } from "@/features/admin/plans/plan-form";
import { BackLink } from "@/components/ui/back-link";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "New Plan",
};

export default async function NewPlanPage() {
  await requireRole(["owner", "manager"]);

  return (
    <div className="container-editorial py-16">
      <BackLink href={ROUTES.adminPlans} label="Back to Plans" />
      <p className="eyebrow mb-4 mt-6">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        New Plan
      </h1>

      <div className="mt-10">
        <PlanForm />
      </div>
    </div>
  );
}
