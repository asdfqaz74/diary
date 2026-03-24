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
      <section className="ambient-shadow w-full max-w-3xl rounded-4xl bg-surface-container-lowest p-8 md:p-12">
        <div className="space-y-4">
          <p className="font-label text-sm uppercase tracking-[0.26em] text-outline">
            Meditation Memoa
          </p>
          <h1 className="font-headline text-4xl font-black leading-tight text-primary md:text-6xl">
            오늘의 마음을,
            <br />
            천천히 기록해보세요.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-on-surface-variant">
            복잡한 생각도, 스쳐 지나간 감정도 한 장의 일기로 남겨보세요.
            로그인하면 오늘의 기록을 이어 쓰고 지난 마음도 다시 돌아볼 수 있어요.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-surface-container p-6">
          {isConfigured ? (
            <>
              <p className="mb-5 font-label text-sm text-on-surface-variant">
                Google 계정으로 바로 시작할 수 있어요. 기록과 임시저장된 초안은
                로그인한 본인만 볼 수 있도록 보호됩니다.
              </p>
              <GoogleLoginButton nextPath={nextPath} />
            </>
          ) : (
            <div className="space-y-4">
              <p className="font-label text-sm font-semibold text-red-700">
                아직 로그인 연결 설정이 완료되지 않았어요.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`,
                `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`을
                채운 뒤 다시 시도해 주세요.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 legacy fallback으로만
                동작합니다.
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">
                빠른 시작은 `README.md`, 자세한 연결 방법은
                `docs/supabase-setup.md`에서 확인할 수 있어요.
              </p>
            </div>
          )}
        </div>

        {errorMessage ? (
          <p className="mt-4 font-label text-sm text-red-700">{errorMessage}</p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-4 font-label text-sm text-on-surface-variant">
          <Link className="underline-offset-4 hover:underline" href="/">
            홈으로 돌아가기
          </Link>
          <Link
            className="underline-offset-4 hover:underline"
            href="https://supabase.com/docs/guides/auth/social-login/auth-google"
            rel="noreferrer"
            target="_blank"
          >
            Google 로그인 설정 가이드
          </Link>
        </div>
      </section>
    </main>
  );
}
