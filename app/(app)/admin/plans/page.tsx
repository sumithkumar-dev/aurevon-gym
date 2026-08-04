import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth/guards";
import { getAllPlans } from "@/lib/supabase/queries/plans";
import { PlansTable } from "@/features/admin/plans/plans-table";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "Plans",
};

export default async function AdminPlansPage() {
  // Plan pricing/duration changes are Owner/Manager only — mirrors
  // `membership_plans_manage_owner_manager` RLS.
  await requireRole(["owner", "manager"]);
  const plans = await getAllPlans();

  return (
    <div className="container-editorial py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-4">Admin Dashboard</p>
          <h1 className="font-display text-display-2 uppercase text-foreground">
            Plans
          </h1>
        </div>
        <Button asChild>
          <Link href={`${ROUTES.adminPlans}/new`}>New Plan</Link>
        </Button>
      </div>

      <div className="mt-10">
        <PlansTable plans={plans} />
      </div>
    </div>
  );
}
