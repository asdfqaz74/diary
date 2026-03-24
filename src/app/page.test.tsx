import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/lib/get-dashboard-data", () => ({
  getDashboardData: vi.fn(async () => ({
    activeMonthIndex: 0,
    calendarMonths: [
      {
        days: [
          { dayNumber: 10, isDisabled: true, isMuted: true, key: "2026-02-10" },
          { dayNumber: 11, hasEntry: true, key: "2026-03-11" },
          { dayNumber: 12, isDisabled: true, key: "2026-03-12" },
          {
            dayNumber: 13,
            hasEntry: true,
            isActive: true,
            key: "2026-03-13",
          },
          { dayNumber: 14, isDisabled: true, key: "2026-03-14" },
        ],
        label: "3월의 기록",
        monthKey: "2026-03",
        weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      },
    ],
    dateLabel: "2026년 3월 13일 금요일 • 맑음",
    headline: "평온한 오후입니다,\n진수님.",
    moodTrend: [
      {
        dayLabel: "어제",
        icon: "sentiment_satisfied",
        intensity: 62,
        moodLabel: "차분함",
      },
    ],
    quoteAuthor: "무명의 명상가",
    quoteText: "마음이 흔들릴 때 비로소 내가 보인다.",
    recentEntries: [
      {
        dateLabel: "MAR 11, 2026",
        entryDate: "2026-03-11",
        excerpt: "지난 기록 미리보기입니다.",
        icon: "bookmark",
        paperClassName: "bg-rose-50/90",
        title: "비 오는 날의 숲속 산책",
      },
    ],
    streak: {
      label: "WEEKLY STREAK",
      value: "7일 연속 일기 쓰기 성공!",
    },
  })),
}));

import Home from "@/app/page";

describe("dashboard page", () => {
  it("renders only allowed entry links on the dashboard", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", { name: "3월의 기록" }),
    ).toBeVisible();
    expect(screen.getByText("7일 연속 일기 쓰기 성공!")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "최근 기록들" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "MAR 11, 2026 일기 열기" }),
    ).toHaveAttribute("href", "/entries/2026-03-11");
    expect(
      screen.getByRole("link", { name: "MAR 11, 2026 일기 열기" }),
    ).toHaveClass("bg-rose-50/90");
    expect(
      screen.getByRole("link", { name: "11일" }),
    ).toHaveAttribute("href", "/entries/2026-03-11");
    expect(
      screen.getByRole("link", { name: "선택된 날짜 13일" }),
    ).toHaveAttribute("href", "/entries/2026-03-13");

    expect(screen.getByText("12").closest("a")).toBeNull();
    expect(screen.getByText("14").closest("a")).toBeNull();
  });
});
