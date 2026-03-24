import { redirect } from "next/navigation";
import { LoginScreen } from "@/features/auth/components/login-screen";
import { getOptionalUser } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "missing_env":
      return "로그인에 필요한 환경 설정이 아직 비어 있어요.";
    case "oauth_callback":
      return "로그인 확인 중 문제가 생겼어요. 한 번 더 시도해 주세요.";
    default:
      return undefined;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const user = await getOptionalUser();

  if (user) {
    redirect("/");
  }

  return (
    <LoginScreen
      errorMessage={getErrorMessage(params?.error)}
      isConfigured={hasSupabasePublicEnv()}
      nextPath={params?.next}
    />
  );
}
