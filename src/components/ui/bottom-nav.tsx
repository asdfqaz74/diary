"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  bottomNavItems,
  isNavItemActive,
} from "@/components/ui/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type BottomNavProps = {
  pathname: string;
};

function HomeSymbol({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M4.75 10.5L12 4.75L19.25 10.5V18C19.25 18.69 18.69 19.25 18 19.25H14.75V14.75H9.25V19.25H6C5.31 19.25 4.75 18.69 4.75 18V10.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BottomNavSymbol({
  filled,
  icon,
}: {
  filled?: boolean;
  icon: string;
}) {
  if (icon === "home") {
    return <HomeSymbol className="h-6 w-6" />;
  }

  return (
    <MaterialSymbol
      filled={filled}
      name={icon}
      opticalSize={24}
      weight={400}
    />
  );
}

export function BottomNav({ pathname }: BottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-primary/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_40px_rgba(48,51,48,0.18)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-sm items-stretch gap-2">
        {bottomNavItems.map((item) => {
          const isActive = isNavItemActive(item, pathname);

          if (item.disabled) {
            return (
              <button
                key={item.label}
                type="button"
                disabled
                aria-label={`하단 탐색: ${item.label}`}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-3 py-2.5 text-white/40"
              >
                <BottomNavSymbol icon={item.icon} />
                <span className="font-label text-[11px] font-semibold tracking-[0.08em]">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              aria-current={isActive ? "page" : undefined}
              aria-label={`하단 탐색: ${item.label}`}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-[1.35rem] px-3 py-2.5 transition",
                isActive
                  ? "bg-primary-container text-primary shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
                  : "text-white/78 hover:bg-white/10 hover:text-white",
              )}
            >
              <BottomNavSymbol filled={isActive} icon={item.icon} />
              <span className="font-label text-[11px] font-semibold tracking-[0.08em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
