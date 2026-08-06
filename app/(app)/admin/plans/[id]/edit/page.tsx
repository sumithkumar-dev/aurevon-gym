import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/guards";
import { getPlanById } from "@/lib/supabase/queries/plans";
import { PlanForm } from "@/features/admin/plans/plan-form";
import { BackLink } from "@/components/ui/back-link";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Edit Plan",
};

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["owner", "manager"]);
  const { id } = await params;

  const plan = await getPlanById(id);
  if (!plan) {
    notFound();
  }

  return (
    <div className="container-editorial py-16">
      <BackLink href={ROUTES.adminPlans} label="Back to Plans" />
      <p className="eyebrow mb-4 mt-6">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        Edit Plan
      </h1>

      <div className="mt-10">
        <PlanForm plan={plan} />
      </div>
    </div>
  );
}
