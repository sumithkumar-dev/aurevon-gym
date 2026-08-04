import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
type MembershipPlan = Database["public"]["Tables"]["membership_plans"]["Row"];

export type MembershipWithPlan = Membership & {
  plan: Pick<
    MembershipPlan,
    "id" | "name" | "slug" | "price_paise" | "duration_days"
  > | null;
};

/**
 * The member's most recent membership row (any status), joined with its
 * plan. Memberships are only ever created after a verified payment or by
 * staff for a walk-in (never by the member portal itself), so a member may
 * have none yet — callers must handle `null` rather than assuming one
 * always exists.
 *
 * Scoped by `memberId` as a read filter; `memberships_select_own_or_staff`
 * RLS is what actually enforces that a member can only ever see their own
 * row when this runs on a session-bound client (`lib/supabase/server.ts`).
 */
export const getCurrentMembership = cache(
  async (memberId: string): Promise<MembershipWithPlan | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memberships")
      .select(
        "*, plan:membership_plans(id, name, slug, price_paise, duration_days)"
      )
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    // Hand-authored `Database` types (see database.types.ts's header
    // comment) don't carry the generated embed-relationship overloads that
    // let postgrest-js infer a joined `select()` shape on its own — cast
    // explicitly to the shape the query above actually returns.
    return data as unknown as MembershipWithPlan | null;
  }
);

/**
 * The member's currently "open" (pending or active) membership, if any —
 * mirrors `memberships_one_open_per_member_idx` (the partial unique index
 * that allows at most one pending/active row per member). Used by the
 * admin offline-payment flow to decide whether to activate an existing
 * membership or create a new one, without racing the index itself.
 */
export const getOpenMembershipForMember = cache(
  async (memberId: string): Promise<Membership | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .eq("member_id", memberId)
      .in("status", ["pending", "active"])
      .maybeSingle();

    if (error) {
      return null;
    }

    return data;
  }
);

/** Studio-wide active/pending membership counts, for the admin overview. */
export const getMembershipCounts = cache(
  async (): Promise<{ active: number; pending: number }> => {
    const supabase = await createClient();
    const [activeResult, pendingResult] = await Promise.all([
      supabase
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

    return {
      active: activeResult.count ?? 0,
      pending: pendingResult.count ?? 0,
    };
  }
);
