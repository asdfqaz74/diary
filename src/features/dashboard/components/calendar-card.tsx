"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import type { CalendarMonth } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type CalendarCardProps = {
  months: CalendarMonth[];
};

export function CalendarCard({ months }: CalendarCardProps) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const activeMonth = months[monthIndex];
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < months.length - 1;

  function handleStep(direction: -1 | 1) {
    startTransition(() => {
      setMonthIndex((currentIndex) => currentIndex + direction);
    });
  }

  return (
    <Card className="p-8 md:p-10 lg:p-12" tone="paper">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-headline text-3xl font-bold tracking-tight text-primary">
            {activeMonth.label}
          </h3>
          <p className="mt-2 font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {isPending ? "달력을 불러오는 중" : "기록이 남아 있는 날짜를 살펴보세요"}
          </p>
        </div>
        <div className="flex gap-2">
          <IconButton
            aria-disabled={!canGoPrev}
            disabled={!canGoPrev}
            icon="chevron_left"
            label="이전 달 보기"
            onClick={() => {
              handleStep(-1);
            }}
          />
          <IconButton
            aria-disabled={!canGoNext}
            disabled={!canGoNext}
            icon="chevron_right"
            label="다음 달 보기"
            onClick={() => {
              handleStep(1);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-8 text-center">
        {activeMonth.weekdayLabels.map((weekday) => (
          <div
            key={weekday}
            className="font-label text-sm font-bold tracking-[0.18em] text-outline-variant"
          >
            {weekday}
          </div>
        ))}

        {activeMonth.days.map((day) => {
          const ariaLabel = day.isActive
            ? `선택된 날짜 ${day.dayNumber}일`
            : `${day.dayNumber}일`;

          return (
            <div
              key={day.key}
              className="flex h-20 items-center justify-center"
            >
              <button
                type="button"
                aria-label={ariaLabel}
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-[1.15rem] text-2xl transition",
                  day.isActive
                    ? "ambient-shadow bg-primary text-on-primary"
                    : "bg-transparent text-on-surface",
                  day.isMuted ? "text-outline-variant/70" : "",
                )}
              >
                {day.dayNumber}
                {day.hasEntry ? (
                  <span
                    className={cn(
                      "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                      day.isActive ? "bg-on-primary" : "bg-primary",
                    )}
                  />
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
