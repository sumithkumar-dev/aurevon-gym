import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/queries/profiles";
import { ADMIN_PAGE_SIZE } from "@/lib/constants/pagination";

export type MemberProfile = Profile;

/**
 * One page of member-role profiles, optionally filtered by a name/email
 * search term, plus the total count matching that filter (for computing
 * how many pages there are). Staff-only in practice — RLS
 * (`profiles_select_own_or_staff`) is what actually enforces that only
 * owner/manager/receptionist callers see rows besides their own.
 *
 * `page` is 1-indexed. Paginated with `.range()` rather than fetching
 * every member — an admin's member list has no natural upper bound, and
 * neither the query nor an unbounded `<table>` render scale to a studio
 * with a few thousand members.
 */
export const getMembers = cache(
  async (
    search?: string,
    page = 1
  ): Promise<{ members: MemberProfile[]; totalCount: number }> => {
    const supabase = await createClient();
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "member")
      .order("full_name", { ascending: true });

    // `.or()` treats `,` as a filter separator and `%`/`_` as ilike
    // wildcards — strip them so a search term can't be misread as extra
    // filter clauses or an unintended wildcard pattern.
    const sanitized = search?.replace(/[,%_]/g, " ").trim();
    if (sanitized) {
      query = query.or(
        `full_name.ilike.%${sanitized}%,email.ilike.%${sanitized}%`
      );
    }

    const from = (page - 1) * ADMIN_PAGE_SIZE;
    const to = from + ADMIN_PAGE_SIZE - 1;

    const { data, error, count } = await query.range(from, to);
    if (error) {
      return { members: [], totalCount: 0 };
    }
    return { members: data, totalCount: count ?? 0 };
  }
);

/**
 * A lightweight, capped list of members for the "Record Payment" `<select>`
 * (id/name/email only, not the full profile). Deliberately separate from
 * the paginated `getMembers()` above — a payment-recording dropdown needs
 * to search across the whole member base, not one page of it, so it
 * can't reuse the same pagination.
 *
 * The cap is a stopgap, not a real fix: a native `<select>` with hundreds
 * of members is already a poor picker experience well before it becomes
 * a query-performance problem. The actual fix is a searchable combobox
 * that queries as the staff member types (same `.ilike()` pattern
 * `getMembers()` already uses) — flagged in the audit report as a
 * follow-up rather than built here, since it's a UI pattern change, not
 * a fix to something broken.
 */
export const getAllMembersForSelect = cache(
  async (): Promise<Pick<MemberProfile, "id" | "full_name" | "email">[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "member")
      .order("full_name", { ascending: true })
      .limit(500);

    if (error) {
      return [];
    }
    return data;
  }
);

/** A single member's profile, `null` if the id doesn't exist or isn't a
 * member (e.g. a staff id was passed in by mistake). */
export const getMemberProfile = cache(
  async (memberId: string): Promise<MemberProfile | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", memberId)
      .eq("role", "member")
      .maybeSingle();

    if (error) {
      return null;
    }
    return data;
  }
);

/** Total member count, for the admin overview. */
export const getMemberCount = cache(async (): Promise<number> => {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "member");

  if (error) {
    return 0;
  }
  return count ?? 0;
});
