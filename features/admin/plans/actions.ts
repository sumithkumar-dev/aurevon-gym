"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/guards";
import { planSchema } from "@/lib/validations/admin";
import { ROUTES } from "@/lib/constants/routes";

export type PlanFormState = { error?: string } | null;

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readPlanForm(formData: FormData) {
  return planSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description"),
    price_rupees: formData.get("price_rupees"),
    duration_days: formData.get("duration_days"),
    features: formData.get("features"),
    is_active: formData.get("is_active"),
    is_featured: formData.get("is_featured"),
    sort_order: formData.get("sort_order"),
  });
}

export async function createPlanAction(
  _prevState: PlanFormState,
  formData: FormData
): Promise<PlanFormState> {
  const staff = await requireRole(["owner", "manager"]);

  const parsed = readPlanForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("membership_plans").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description,
    price_paise: Math.round(parsed.data.price_rupees * 100),
    duration_days: parsed.data.duration_days,
    features: parseFeatures(parsed.data.features),
    is_active: parsed.data.is_active,
    is_featured: parsed.data.is_featured,
    sort_order: parsed.data.sort_order,
  });

  if (error) {
    console.error("[admin:plans] create failed", {
      staffId: staff.id,
      error: error.message,
    });
    return {
      error: error.message.includes("duplicate")
        ? "A plan with that slug already exists."
        : "Something went wrong. Please try again.",
    };
  }

  console.info("[admin:plans] plan created", {
    staffId: staff.id,
    slug: parsed.data.slug,
  });

  revalidatePath(ROUTES.adminPlans);
  redirect(ROUTES.adminPlans);
}

export async function updatePlanAction(
  planId: string,
  _prevState: PlanFormState,
  formData: FormData
): Promise<PlanFormState> {
  const staff = await requireRole(["owner", "manager"]);

  const parsed = readPlanForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("membership_plans")
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description,
      price_paise: Math.round(parsed.data.price_rupees * 100),
      duration_days: parsed.data.duration_days,
      features: parseFeatures(parsed.data.features),
      is_active: parsed.data.is_active,
      is_featured: parsed.data.is_featured,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", planId);

  if (error) {
    console.error("[admin:plans] update failed", {
      staffId: staff.id,
      planId,
      error: error.message,
    });
    return {
      error: error.message.includes("duplicate")
        ? "A plan with that slug already exists."
        : "Something went wrong. Please try again.",
    };
  }

  console.info("[admin:plans] plan updated", { staffId: staff.id, planId });

  revalidatePath(ROUTES.adminPlans);
  redirect(ROUTES.adminPlans);
}
