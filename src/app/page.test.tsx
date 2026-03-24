import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/dashboard/lib/get-dashboard-data", () => ({
  getDashboardData: vi.fn(async () => ({
    activeMonthIndex: 1,
    calendarMonths: [
      {
        days: [
          { dayNumber: 28, isMuted: true, key: "2026-02-28" },
          { dayNumber: 1, hasEntry: true, key: "2026-03-01" },
          { dayNumber: 2, key: "2026-03-02" },
          { dayNumber: 3, hasEntry: true, key: "2026-03-03" },
        ],
        label: "3월의 기록",
        monthKey: "2026-03",
        weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      },
      {
        days: [
          { dayNumber: 30, isMuted: true, key: "2026-03-30" },
          { dayNumber: 1, hasEntry: true, key: "2026-04-01" },
          { dayNumber: 2, key: "2026-04-02" },
          {
            dayNumber: 3,
            hasEntry: true,
            isActive: true,
            key: "2026-04-03",
          },
        ],
        label: "4월의 기록",
        monthKey: "2026-04",
        weekdayLabels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      },
    ],
    dateLabel: "2026년 3월 3일 화요일 · 맑음",
    headline: "평온한 오후입니다,\n진수님.",
    moodTrend: [
      {
        dayLabel: "어제",
        icon: "sentiment_satisfied",
        intensity: 62,
        moodLabel: "차분함",
      },
      {
        dayLabel: "그저께",
        icon: "sentiment_very_satisfied",
        intensity: 82,
        moodLabel: "명상하는 마음",
      },
    ],
    quoteAuthor: "무명의 명상가",
    quoteText: "마음이 흔들릴 때 비로소 내가 보인다.",
    recentEntries: [
      {
        dateLabel: "MAR 02, 2026",
        entryDate: "2026-03-02",
        excerpt: "지난 기록의 일부를 미리보기로 보여줍니다.",
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
  it("renders the active month first and links calendar/preview cards to entry detail", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", { name: "4월의 기록" }),
    ).toBeVisible();
    expect(screen.getByText("7일 연속 일기 쓰기 성공!")).toBeVisible();
    expect(screen.getByRole("heading", { name: "최근 기록들" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "MAR 02, 2026 일기 열기" }),
    ).toHaveAttribute("href", "/entries/2026-03-02");
    expect(
      screen.getByRole("link", { name: "MAR 02, 2026 일기 열기" }),
    ).toHaveClass("bg-rose-50/90");
    expect(
      screen.getByRole("link", { name: "선택한 날짜 3일" }),
    ).toHaveAttribute("href", "/entries/2026-04-03");

    fireEvent.click(screen.getByRole("button", { name: "이전 달 보기" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "3월의 기록" })).toBeVisible();
    });
  });
});
