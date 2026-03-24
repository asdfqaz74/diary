import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { LoginScreen } from "@/features/auth/components/login-screen";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "missing_env":
      return "Supabase 환경변수가 없어서 보호된 페이지를 열 수 없습니다.";
    case "oauth_callback":
      return "OAuth 콜백 처리 중 오류가 발생했습니다.";
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
