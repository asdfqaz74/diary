import Link from "next/link";
import { GoogleLoginButton } from "@/features/auth/components/google-login-button";

type LoginScreenProps = {
  errorMessage?: string;
  isConfigured: boolean;
  nextPath?: string;
};

export function LoginScreen({
  errorMessage,
  isConfigured,
  nextPath,
}: LoginScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="ambient-shadow w-full max-w-3xl rounded-[2rem] bg-surface-container-lowest p-8 md:p-12">
        <div className="space-y-4">
          <p className="font-label text-sm uppercase tracking-[0.26em] text-outline">
            Meditation Diary
          </p>
          <h1 className="font-headline text-4xl font-black leading-tight text-primary md:text-6xl">
            명상 메모아에
            <br />
            Google 계정으로 로그인하세요.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">
            로그인 후에는 내 기록만 볼 수 있고, 초안 자동 저장과 하루 1개
            발행 규칙이 Supabase RLS 기준으로 보호됩니다.
          </p>
        </div>

        <div className="mt-10 rounded-[1.5rem] bg-surface-container p-6">
          {isConfigured ? (
            <>
              <p className="mb-5 font-label text-sm text-on-surface-variant">
                아직 Supabase가 익숙하지 않아도 됩니다. 현재 프로젝트는
                Google OAuth 와 세션 쿠키 흐름이 이미 연결되도록 구성됩니다.
              </p>
              <GoogleLoginButton nextPath={nextPath} />
            </>
          ) : (
            <div className="space-y-4">
              <p className="font-label text-sm font-semibold text-red-700">
                Supabase 환경변수가 아직 없습니다.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                `.env.local` 에 `NEXT_PUBLIC_SUPABASE_URL`,
                `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`
                을 채운 뒤 다시 시도하세요.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 는 legacy fallback 으로만
                읽습니다.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                빠른 시작은 `README.md` 와 `docs/supabase-setup.md` 기준으로
                따라가면 됩니다.
              </p>
            </div>
          )}
        </div>

        {errorMessage ? (
          <p className="mt-4 font-label text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-4 font-label text-sm text-on-surface-variant">
          <Link className="underline-offset-4 hover:underline" href="/">
            홈으로 이동
          </Link>
          <Link
            className="underline-offset-4 hover:underline"
            href="https://supabase.com/docs/guides/auth/social-login/auth-google"
            target="_blank"
            rel="noreferrer"
          >
            Google OAuth 공식 가이드
          </Link>
        </div>
      </section>
    </main>
  );
}
