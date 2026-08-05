import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/supabase/queries/profiles";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";

export type Payment = Database["public"]["Tables"]["payments"]["Row"];
type MembershipPlan = Database["public"]["Tables"]["membership_plans"]["Row"];

export type PaymentWithPlan = Payment & {
  plan: Pick<MembershipPlan, "name" | "slug"> | null;
};

export type PaymentWithMemberAndPlan = Payment & {
  plan: Pick<MembershipPlan, "name" | "slug"> | null;
  member: Pick<Profile, "full_name" | "email"> | null;
};

/**
 * All payments for a member, most recent first. Scoped by `memberId` as a
 * read filter; `payments_select_own_or_staff` RLS enforces that a member
 * can only ever see their own rows when this runs on a session-bound
 * client (`lib/supabase/server.ts`).
 */
export const getPaymentsForMember = cache(
  async (memberId: string): Promise<PaymentWithPlan[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*, plan:membership_plans(name, slug)")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    // See the equivalent comment in queries/memberships.ts re: the
    // hand-authored `Database` type not inferring embedded selects.
    return data as unknown as PaymentWithPlan[];
  }
);

/**
 * One page of payments across every member, most recent first —
 * staff-only in practice (RLS: `payments_select_own_or_staff`). Used by
 * the admin Payments list. Disambiguates the `member` embed with the FK
 * name because `payments` also has a `recorded_by` FK to `profiles`.
 *
 * `page` is 1-indexed. Paginated with `.range()` — a studio's payment
 * history only grows, and an unbounded fetch (plus an unbounded
 * `<table>` render) doesn't scale to a few years of transaction volume.
 */
export const getAllPayments = cache(
  async (
    page = 1
  ): Promise<{ payments: PaymentWithMemberAndPlan[]; totalCount: number }> => {
    const supabase = await createClient();
    const from = (page - 1) * ADMIN_PAGE_SIZE;
    const to = from + ADMIN_PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("payments")
      .select(
        "*, plan:membership_plans(name, slug), member:profiles!payments_member_id_fkey(full_name, email)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return { payments: [], totalCount: 0 };
    }

    return {
      payments: data as unknown as PaymentWithMemberAndPlan[],
      totalCount: count ?? 0,
    };
  }
);

/**
 * All-time and current-calendar-month revenue (captured payments only),
 * for the admin overview. Aggregated in SQL via `get_revenue_summary()`
 * (see `supabase/migrations/20260805000002_revenue_summary_rpc.sql`)
 * rather than fetching every captured payment row and summing it in
 * JavaScript, which doesn't scale past a studio's first year or two of
 * transaction volume.
 */
export const getRevenueSummary = cache(
  async (): Promise<{ allTimePaise: number; thisMonthPaise: number }> => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_revenue_summary");

    if (error || !data?.[0]) {
      return { allTimePaise: 0, thisMonthPaise: 0 };
    }

    return {
      allTimePaise: data[0].all_time_paise,
      thisMonthPaise: data[0].this_month_paise,
    };
  }
);
