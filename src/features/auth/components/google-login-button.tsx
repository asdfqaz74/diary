"use client";

import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

type GoogleLoginButtonProps = {
  nextPath?: string;
};

export function GoogleLoginButton({
  nextPath = "/",
}: GoogleLoginButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSignIn() {
    startTransition(() => {
      void (async () => {
        try {
          const env = getSupabasePublicEnv();

          if (!env) {
            setErrorMessage("먼저 .env.local 에 Supabase 환경변수를 채워주세요.");
            return;
          }

          const redirectUrl = new URL("/auth/callback", env.appUrl);
          redirectUrl.searchParams.set("next", nextPath);

          const supabase = createSupabaseBrowserClient();
          const { error } = await supabase.auth.signInWithOAuth({
            options: {
              redirectTo: redirectUrl.toString(),
            },
            provider: "google",
          });

          if (error) {
            setErrorMessage("Google 로그인 연결에 실패했습니다.");
          }
        } catch {
          setErrorMessage("로그인 준비 중 오류가 발생했습니다.");
        }
      })();
    });
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 font-label text-base font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Google 로그인 연결 중..." : "Google로 시작하기"}
      </button>
      {errorMessage ? (
        <p className="font-label text-sm text-red-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
