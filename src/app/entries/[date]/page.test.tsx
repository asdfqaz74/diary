import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockNotFound } = vi.hoisted(() => ({
  mockNotFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>(
    "next/navigation",
  );

  return {
    ...actual,
    notFound: mockNotFound,
    useRouter: () => ({
      push: vi.fn(),
      refresh: vi.fn(),
    }),
  };
});

vi.mock("@/features/entries/lib/get-entry-detail-data", () => ({
  getEntryDetailData: vi.fn(async (entryDate: string) => ({
    body: "햇빛을 따라가며 마음도 가볍게 정리됐다.",
    dateLabel: "2026년 3월 24일",
    editHref: `/entries/${entryDate}/edit`,
    entryDate,
    kind: "entry",
    locationLabel: "서울, 대한민국",
    moodLabel: "평온함",
    paperClassName: "bg-rose-50/90",
    savedAtLabel: "3월 24일 오후 2:45",
    subtitle: "TUESDAY AFTERNOON",
    title: "고요한 오후의 기록",
    weatherLabel: "맑은 하늘",
  })),
}));

import EntryDetailPage from "@/app/entries/[date]/page";

describe("entry detail page", () => {
  it("renders a read-only entry detail view with edit and delete actions", async () => {
    render(
      await EntryDetailPage({
        params: Promise.resolve({ date: "2026-03-24" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "2026년 3월 24일" }),
    ).toBeVisible();
    expect(screen.getByText("고요한 오후의 기록")).toBeVisible();
    expect(screen.getByText("햇빛을 따라가며 마음도 가볍게 정리됐다.")).toBeVisible();
    expect(
      screen.getByRole("link", { name: /수정하기/ }),
    ).toHaveAttribute("href", "/entries/2026-03-24/edit");
    expect(screen.getByRole("button", { name: /삭제하기/ })).toBeVisible();
    expect(screen.getByText("고요한 오후의 기록").closest("div")).toHaveClass(
      "bg-rose-50/90",
    );
  });

  it("throws notFound for an invalid date segment", async () => {
    await expect(
      EntryDetailPage({
        params: Promise.resolve({ date: "not-a-date" }),
      }),
    ).rejects.toThrow("NOT_FOUND");
  });
});
