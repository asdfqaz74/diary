"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import type { CalendarMonth } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type CalendarCardProps = {
  initialMonthIndex: number;
  months: CalendarMonth[];
};

export function CalendarCard({ initialMonthIndex, months }: CalendarCardProps) {
  const [monthIndex, setMonthIndex] = useState(() =>
    initialMonthIndex >= 0 ? initialMonthIndex : 0,
  );
  const [isPending, startTransition] = useTransition();
  const activeMonth = months[monthIndex] ?? months[0];
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < months.length - 1;

  function handleStep(direction: -1 | 1) {
    startTransition(() => {
      setMonthIndex((currentIndex) => currentIndex + direction);
    });
  }

  function getWeekdayLabelClass(index: number) {
    if (index === 0) {
      return "text-red-500";
    }

    if (index === 6) {
      return "text-blue-500";
    }

    return "text-outline-variant";
  }

  function getDayNumberClass(
    weekdayIndex: number,
    isActive?: boolean,
    isMuted?: boolean,
  ) {
    if (isActive) {
      return "!font-black !text-white";
    }

    if (weekdayIndex === 0) {
      return isMuted ? "text-red-300" : "text-red-500";
    }

    if (weekdayIndex === 6) {
      return isMuted ? "text-blue-300" : "text-blue-500";
    }

    return isMuted ? "text-outline-variant/70" : "text-on-surface";
  }

  return (
    <Card className="p-6 md:p-10 lg:p-12" tone="paper">
      <div className="mb-8 flex items-center justify-between gap-4 md:mb-10">
        <div>
          <h3 className="font-headline text-3xl font-bold tracking-tight text-primary">
            {activeMonth.label}
          </h3>
          <p className="mt-2 font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant">
            {isPending ? "달력을 불러오는 중" : "기록이 있는 날짜만 열 수 있어요"}
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

      <div className="grid grid-cols-7 gap-y-6 text-center md:gap-y-8">
        {activeMonth.weekdayLabels.map((weekday, index) => (
          <div
            key={weekday}
            className={cn(
              "font-label text-sm font-bold tracking-[0.18em]",
              getWeekdayLabelClass(index),
            )}
          >
            <span className="md:hidden">{weekday.slice(0, 1)}</span>
            <span className="hidden md:inline">{weekday}</span>
          </div>
        ))}

        {activeMonth.days.map((day) => {
          const weekdayIndex = new Date(`${day.key}T00:00:00Z`).getUTCDay();
          const sharedClasses = cn(
            "relative flex h-12 w-12 items-center justify-center rounded-[1rem] text-xl transition md:h-14 md:w-14 md:rounded-[1.15rem] md:text-2xl",
            day.isActive
              ? "ambient-shadow bg-primary"
              : day.isDisabled
                ? "cursor-default opacity-55"
                : "bg-transparent hover:bg-surface-container-low",
          );
          const dayNumber = (
            <span
              className={cn(
                "calendar-day-number relative z-10",
                getDayNumberClass(weekdayIndex, day.isActive, day.isMuted),
              )}
            >
              {day.dayNumber}
            </span>
          );
          const dot = day.hasEntry ? (
            <span
              className={cn(
                "absolute bottom-1.5 h-1.5 w-1.5 rounded-full",
                day.isActive ? "bg-on-primary" : "bg-primary",
              )}
            />
          ) : null;

          return (
            <div
              key={day.key}
              className="flex h-16 items-center justify-center md:h-20"
            >
              {day.isDisabled ? (
                <div
                  aria-disabled="true"
                  className={sharedClasses}
                >
                  {dayNumber}
                  {dot}
                </div>
              ) : (
                <Link
                  aria-label={
                    day.isActive
                      ? `선택된 날짜 ${day.dayNumber}일`
                      : `${day.dayNumber}일`
                  }
                  href={`/entries/${day.key}`}
                  className={sharedClasses}
                >
                  {dayNumber}
                  {dot}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
