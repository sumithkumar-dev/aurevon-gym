import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];

/**
 * All invoices for a member, most recent first. Used to attach an invoice
 * number/PDF link to a payment row once one has been generated (invoices
 * are 1:1 with a captured/offline-confirmed payment — see
 * `supabase/migrations/20260802000006_invoices.sql`).
 *
 * Scoped by `memberId` as a read filter; `invoices_select_own_or_staff`
 * RLS enforces that a member can only ever see their own rows when this
 * runs on a session-bound client (`lib/supabase/server.ts`).
 */
export const getInvoicesForMember = cache(
  async (memberId: string): Promise<Invoice[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("member_id", memberId)
      .order("issued_at", { ascending: false });

    if (error) {
      return [];
    }

    return data;
  }
);
