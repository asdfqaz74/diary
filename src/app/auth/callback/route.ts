import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next") ?? "/";

  if (!hasSupabasePublicEnv()) {
    return NextResponse.redirect(new URL("/login?error=missing_env", requestUrl));
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback", requestUrl),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback", requestUrl),
    );
  }

  const nextUrl = new URL(nextPath, requestUrl);

  return NextResponse.redirect(nextUrl);
}
