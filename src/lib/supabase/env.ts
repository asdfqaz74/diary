export type SupabasePublicEnv = {
  appUrl: string;
  publishableKey: string;
  url: string;
};

function trimEnv(value: string | undefined) {
  return value?.trim();
}

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey =
    trimEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    trimEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const appUrl = trimEnv(process.env.NEXT_PUBLIC_APP_URL);

  if (!url || !publishableKey || !appUrl) {
    return null;
  }

  return {
    appUrl,
    publishableKey,
    url,
  };
}

export function hasSupabasePublicEnv() {
  return getSupabasePublicEnv() !== null;
}

export function requireSupabasePublicEnv() {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase public environment variables are missing. Check .env.local against .env.example. Use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; NEXT_PUBLIC_SUPABASE_ANON_KEY is only a legacy fallback.",
    );
  }

  return env;
}
