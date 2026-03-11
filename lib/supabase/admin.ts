import { createClient } from "@supabase/supabase-js";

import { getSupabaseServiceRoleEnv } from "./env";
import type { Database } from "./types";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const { url, serviceRoleKey } = getSupabaseServiceRoleEnv();
  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
