import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/queries/profiles";

export type MemberProfile = Profile;

/**
 * All member-role profiles, optionally filtered by a name/email search
 * term. Staff-only in practice — RLS (`profiles_select_own_or_staff`) is
 * what actually enforces that only owner/manager/receptionist callers see
 * rows besides their own.
 */
export const getMembers = cache(
  async (search?: string): Promise<MemberProfile[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("profiles")
      .select("*")
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

    const { data, error } = await query;
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
