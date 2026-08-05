"use client";

import { useActionState } from "react";
import { recordPaymentAction, type RecordPaymentState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/features/memberships/status";
import type { MemberProfile } from "@/lib/supabase/queries/members";
import type { Plan } from "@/lib/supabase/queries/plans";

const initialState: RecordPaymentState = null;

export function RecordPaymentForm({
  members,
  plans,
}: {
  members: Pick<MemberProfile, "id" | "full_name" | "email">[];
  plans: Plan[];
}) {
  const [state, formAction, isPending] = useActionState(
    recordPaymentAction,
    initialState
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="memberId">Member</Label>
        <Select id="memberId" name="memberId" required defaultValue="">
          <option value="" disabled>
            Select a member
          </option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.full_name || member.email} — {member.email}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="planId">Plan</Label>
        <Select id="planId" name="planId" required defaultValue="">
          <option value="" disabled>
            Select a plan
          </option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} — {formatCurrency(plan.price_paise)}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          name="notes"
          placeholder="e.g. Paid by card at front desk"
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Recording…" : "Record Payment"}
      </Button>
    </form>
  );
}
