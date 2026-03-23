import { Card } from "@/components/ui/card";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { MoodTrendPoint } from "@/features/dashboard/types";

type MoodTrendCardProps = {
  points: MoodTrendPoint[];
};

export function MoodTrendCard({ points }: MoodTrendCardProps) {
  const recentRows = points.slice(0, 2);

  return (
    <Card className="p-8" tone="muted">
      <h3 className="font-headline text-2xl font-bold text-on-surface">
        최근의 기분 흐름
      </h3>

      <div className="mt-8 space-y-6">
        {recentRows.map((point) => (
          <div
            key={point.dayLabel}
            className="flex items-center justify-between gap-4"
          >
            <span className="font-label text-lg text-on-surface-variant">
              {point.dayLabel}
            </span>
            <div className="flex items-center gap-2 text-primary">
              <MaterialSymbol
                filled
                name={point.icon}
                opticalSize={28}
                weight={500}
              />
              <span className="text-xl">{point.moodLabel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex h-28 items-end gap-2 px-2">
        {points.map((point, index) => {
          const barClass =
            index === 2 || index === points.length - 1
              ? "bg-primary"
              : index % 2 === 0
                ? "bg-primary/18"
                : "bg-primary/42";

          return (
            <div
              key={`${point.dayLabel}-${point.intensity}`}
              aria-label={`${point.dayLabel}의 기분 강도 ${point.intensity}`}
              className={`w-full rounded-t-sm ${barClass}`}
              style={{ height: `${point.intensity}%` }}
            />
          );
        })}
      </div>
    </Card>
  );
}
