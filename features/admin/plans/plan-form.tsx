"use client";

import { useActionState } from "react";
import {
  createPlanAction,
  updatePlanAction,
  type PlanFormState,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Plan } from "@/lib/supabase/queries/plans";

const initialState: PlanFormState = null;

function featuresToLines(features: Plan["features"] | undefined): string {
  return Array.isArray(features) ? features.join("\n") : "";
}

export function PlanForm({ plan }: { plan?: Plan }) {
  const action = plan ? updatePlanAction.bind(null, plan.id) : createPlanAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={plan?.name} required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={plan?.slug}
            required
            pattern="[a-z0-9-]+"
            placeholder="e.g. gold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={plan?.description}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="price_rupees">Price (₹)</Label>
          <Input
            id="price_rupees"
            name="price_rupees"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={plan ? plan.price_paise / 100 : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="duration_days">Duration (days)</Label>
          <Input
            id="duration_days"
            name="duration_days"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={plan?.duration_days ?? 30}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            step={1}
            defaultValue={plan?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          name="features"
          rows={6}
          defaultValue={featuresToLines(plan?.features)}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={plan ? plan.is_active : true}
            className="h-4 w-4 border border-border bg-surface accent-accent"
          />
          Active (visible to members)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={plan?.is_featured ?? false}
            className="h-4 w-4 border border-border bg-surface accent-accent"
          />
          Featured
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : plan ? "Save Changes" : "Create Plan"}
      </Button>
    </form>
  );
}
