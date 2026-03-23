"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/ui/bottom-nav";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import {
  isComposeRoute,
  isHomeRoute,
} from "@/components/ui/navigation";
import { SidebarNav } from "@/components/ui/sidebar-nav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showDashboardFab = isHomeRoute(pathname);

  return (
    <>
      <SidebarNav pathname={pathname} />
      <div className="min-h-screen pb-28 md:pl-[22rem] md:pb-0">{children}</div>
      <BottomNav pathname={pathname} />
      {showDashboardFab ? (
        <FloatingActionButton
          href="/entries/new"
          icon="edit_note"
          label="오늘의 일기"
        />
      ) : null}
      {isComposeRoute(pathname) ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent md:hidden" />
      ) : null}
    </>
  );
}
