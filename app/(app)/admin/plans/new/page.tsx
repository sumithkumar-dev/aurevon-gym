import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { PlanForm } from "@/features/admin/plans/plan-form";

export const metadata: Metadata = {
  title: "New Plan",
};

export default async function NewPlanPage() {
  await requireRole(["owner", "manager"]);

  return (
    <div className="container-editorial py-16">
      <p className="eyebrow mb-4">Admin Dashboard</p>
      <h1 className="font-display text-display-2 uppercase text-foreground">
        New Plan
      </h1>

      <div className="mt-10">
        <PlanForm />
      </div>
    </div>
  );
}
