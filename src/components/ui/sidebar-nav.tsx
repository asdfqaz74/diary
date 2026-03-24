"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  isComposeRoute,
  isHomeRoute,
  isNavItemActive,
  sidebarItems,
} from "@/components/ui/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type SidebarNavProps = {
  pathname: string;
};

export function SidebarNav({ pathname }: SidebarNavProps) {
  const isCompose = isComposeRoute(pathname);

  return (
    <aside className="ambient-shadow fixed inset-y-0 left-0 z-30 hidden w-88 flex-col rounded-r-[1.75rem] bg-surface-container px-8 py-8 md:flex">
      <div className="space-y-2">
        <h1 className="font-headline text-[2rem] font-bold tracking-[0.22em] text-primary">
          명상 메모아
        </h1>
        <p className="font-label text-sm text-on-surface-variant">
          오늘의 마음을 기록하세요
        </p>
      </div>

      <div className="mt-12 flex items-center gap-4 rounded-[1.75rem] bg-surface px-5 py-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7dfab] text-2xl">
          🧘
        </div>
        <div>
          <p className="text-lg font-bold text-primary">
            오늘의 마음을 기록해요
          </p>
          <p className="font-label text-sm text-on-surface-variant">
            기록 전문가
          </p>
        </div>
      </div>

      <nav className="mt-12 flex flex-col gap-3">
        {sidebarItems.map((item) => {
          const isActive = isNavItemActive(item, pathname);

          if (item.disabled) {
            return (
              <button
                key={item.label}
                type="button"
                disabled
                aria-label={`사이드바: ${item.label}`}
                className="flex items-center gap-4 rounded-[1.2rem] px-4 py-4 text-left text-on-surface-variant"
              >
                <MaterialSymbol
                  name={item.icon}
                  opticalSize={24}
                  weight={350}
                />
                <span className="text-lg">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              aria-current={isActive ? "page" : undefined}
              aria-label={`사이드바: ${item.label}`}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-[1.2rem] px-4 py-4 text-lg transition",
                isActive
                  ? "ambient-shadow bg-surface-container-lowest text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              <MaterialSymbol
                className={
                  isActive ? "text-primary" : "text-on-surface-variant"
                }
                name={item.icon}
                opticalSize={24}
                weight={350}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        aria-current={isCompose ? "page" : undefined}
        aria-label="사이드바: 새 일기 쓰기"
        href="/entries/new"
        className={cn(
          "mt-auto flex items-center justify-center gap-3 rounded-[1.3rem] px-6 py-5 font-label text-lg font-semibold transition",
          isCompose
            ? "deep-shadow bg-primary-dim text-on-primary"
            : "bg-primary text-on-primary hover:bg-primary-dim",
        )}
      >
        <MaterialSymbol
          filled={isCompose}
          name={isHomeRoute(pathname) ? "edit" : "add"}
          className="text-white"
        />
        <span className="text-white">새 일기 쓰기</span>
      </Link>
    </aside>
  );
}
