"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconOnly?: boolean;
  label?: string;
};

export function LogoutButton({
  className,
  iconOnly = false,
  label = "로그아웃",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      void (async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      })();
    });
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={handleLogout}
        disabled={isPending}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-primary disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      >
        <MaterialSymbol name="logout" opticalSize={22} weight={350} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[rgba(92,111,97,0.18)] px-4 py-2 font-label text-sm font-semibold text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      <MaterialSymbol name="logout" opticalSize={18} weight={350} />
      <span>{isPending ? "로그아웃 중..." : label}</span>
    </button>
  );
}
