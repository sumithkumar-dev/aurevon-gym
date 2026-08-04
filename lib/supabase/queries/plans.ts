import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Plan = Database["public"]["Tables"]["membership_plans"]["Row"];

/**
 * Every plan, active or not. Staff-only in practice — RLS
 * (`membership_plans_select_active_or_staff`) only returns inactive rows
 * to owner/manager/receptionist callers; anon/public callers only ever
 * see `is_active = true` rows. Used by the admin Plans list.
 */
export const getAllPlans = cache(async (): Promise<Plan[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }
  return data;
});

/** Active plans only — what the offline payment-recording form and (once
 * connected) the public /membership page should offer. */
export const getActivePlans = cache(async (): Promise<Plan[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return [];
  }
  return data;
});

export const getPlanById = cache(async (id: string): Promise<Plan | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return null;
  }
  return data;
});
