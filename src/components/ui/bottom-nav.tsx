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

export function BottomNav({ pathname }: BottomNavProps) {
  return (
    <nav className="glass-nav fixed inset-x-0 bottom-0 z-30 flex items-center justify-around rounded-t-[2rem] px-6 pb-8 pt-4 md:hidden">
      {bottomNavItems.map((item) => {
        const isActive = isNavItemActive(item, pathname);

        if (item.disabled) {
          return (
            <button
              key={item.label}
              type="button"
              disabled
              aria-label={`하단 탐색: ${item.label}`}
              className="flex h-12 w-12 items-center justify-center text-outline"
            >
              <MaterialSymbol name={item.icon} opticalSize={26} />
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
              "flex h-12 w-12 items-center justify-center rounded-full transition",
              isActive
                ? "bg-primary-container text-primary"
                : "text-outline hover:bg-surface-container-low",
            )}
          >
            <MaterialSymbol
              filled={isActive}
              name={item.icon}
              opticalSize={26}
              weight={400}
            />
          </Link>
        );
      })}
    </nav>
  );
}
