import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CalendarCard } from "@/features/dashboard/components/calendar-card";

describe("CalendarCard", () => {
  it("colors weekends, keeps today active, and disables blocked dates", () => {
    render(
      <CalendarCard
        initialMonthIndex={0}
        months={[
          {
            days: [
              { dayNumber: 30, isDisabled: true, isMuted: true, key: "2026-03-30" },
              { dayNumber: 31, isDisabled: true, isMuted: true, key: "2026-03-31" },
              { dayNumber: 1, hasEntry: true, key: "2026-04-01" },
              { dayNumber: 2, isDisabled: true, key: "2026-04-02" },
              { dayNumber: 3, key: "2026-04-03" },
              { dayNumber: 4, hasEntry: true, key: "2026-04-04" },
              { dayNumber: 5, hasEntry: true, isActive: true, key: "2026-04-05" },
            ],
            label: "4월의 기록",
            monthKey: "2026-04",
            weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
          },
        ]}
      />,
    );

    expect(screen.getByText("SUN").parentElement).toHaveClass("text-red-500");
    expect(screen.getByText("SAT").parentElement).toHaveClass("text-blue-500");
    expect(
      screen
        .getByRole("link", { name: "4일" })
        .querySelector(".calendar-day-number"),
    ).toHaveClass("text-blue-500");
    expect(
      screen
        .getByRole("link", { name: "선택된 날짜 5일" })
        .querySelector(".calendar-day-number"),
    ).toHaveClass("!font-black", "!text-white");
    expect(screen.getByText("2").closest("a")).toBeNull();
  });
});
