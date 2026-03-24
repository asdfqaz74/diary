import type { StreakSummary } from "@/features/dashboard/types";
import { PillBadge } from "@/components/ui/pill-badge";

type StreakBadgeProps = {
  streak: StreakSummary;
};

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <PillBadge className="self-start px-6 py-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-3xl">
        <span aria-hidden="true" className="leading-none">
          🔥
        </span>
      </div>
      <div className="space-y-1">
        <p className="font-headline text-xl font-bold text-primary">
          {streak.value}
        </p>
        <p className="font-label text-xs uppercase tracking-[0.26em] text-on-surface-variant">
          {streak.label}
        </p>
      </div>
    </PillBadge>
  );
}
