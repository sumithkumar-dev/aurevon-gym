import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Fetches a profile by id. Wrapped in React's `cache()` so multiple calls
 * within the same request (e.g. a layout and a page both checking the
 * current user) only hit the database once.
 */
export const getProfileById = cache(
  async (id: string): Promise<Profile | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return data;
  }
);
