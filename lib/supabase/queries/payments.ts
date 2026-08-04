import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/supabase/queries/profiles";

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
 * Every payment across every member, most recent first — staff-only in
 * practice (RLS: `payments_select_own_or_staff`). Used by the admin
 * Payments list. Disambiguates the `member` embed with the FK name
 * because `payments` also has a `recorded_by` FK to `profiles`.
 */
export const getAllPayments = cache(
  async (): Promise<PaymentWithMemberAndPlan[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select(
        "*, plan:membership_plans(name, slug), member:profiles!payments_member_id_fkey(full_name, email)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return [];
    }

    return data as unknown as PaymentWithMemberAndPlan[];
  }
);

/** All-time and current-calendar-month revenue (captured payments only),
 * for the admin overview. Summed client-side rather than via a DB view —
 * fine at a single-studio's payment volume, and avoids a schema change
 * for this phase. */
export const getRevenueSummary = cache(
  async (): Promise<{ allTimePaise: number; thisMonthPaise: number }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("amount_paise, created_at")
      .eq("status", "captured");

    if (error || !data) {
      return { allTimePaise: 0, thisMonthPaise: 0 };
    }

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    return data.reduce(
      (totals, payment) => {
        totals.allTimePaise += payment.amount_paise;
        if (new Date(payment.created_at) >= monthStart) {
          totals.thisMonthPaise += payment.amount_paise;
        }
        return totals;
      },
      { allTimePaise: 0, thisMonthPaise: 0 }
    );
  }
);
