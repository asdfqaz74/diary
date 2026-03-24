"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { requireSupabasePublicEnv } from "@/lib/supabase/env";

let browserClient:
  | ReturnType<typeof createBrowserClient<Database>>
  | undefined;

export function createSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = requireSupabasePublicEnv();

  browserClient = createBrowserClient<Database>(env.url, env.publishableKey);

  return browserClient;
}
