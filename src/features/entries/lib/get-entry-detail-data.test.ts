import { afterEach, describe, expect, it, vi } from "vitest";

const {
  createSupabaseServerClientMock,
  mockNotFound,
  requireUserMock,
} = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  mockNotFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  requireUserMock: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

vi.mock("@/lib/auth", () => ({
  requireUser: requireUserMock,
}));

vi.mock("@/lib/date", async () => {
  const actual = await vi.importActual<typeof import("@/lib/date")>(
    "@/lib/date",
  );

  return {
    ...actual,
    formatEnglishWeekdayPeriodForDate: vi.fn(() => "TUESDAY AFTERNOON"),
    formatKoreanEditorDate: vi.fn(() => "2026년 3월 24일"),
    getTodayIsoDate: vi.fn(() => "2026-03-24"),
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

import { getEntryDetailData } from "@/features/entries/lib/get-entry-detail-data";

function createMockSupabaseClient(entry: Record<string, unknown> | null) {
  return {
    from(table: string) {
      if (table === "profiles") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: { timezone: "Asia/Seoul" },
              }),
            }),
          }),
        };
      }

      if (table === "entries") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({
                  data: entry,
                }),
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    },
  };
}

describe("getEntryDetailData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty today state when there is no entry yet", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient(null),
    );

    const result = await getEntryDetailData("2026-03-24");

    expect(result.kind).toBe("empty");
    expect(result.editHref).toBe("/entries/2026-03-24/edit");
  });

  it("returns the existing past entry details", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        body: "고요한 오후의 기록입니다.",
        entry_date: "2026-03-20",
        location_name: "서울, 대한민국",
        mood_label_snapshot: "평온함",
        paper_tint_code: "mist",
        published_at: "2026-03-20T05:45:00.000Z",
        title: "지난 기록",
        weather_label_snapshot: "맑은 하늘",
      }),
    );

    const result = await getEntryDetailData("2026-03-20");

    expect(result.kind).toBe("entry");
    expect(result.entryDate).toBe("2026-03-20");
  });

  it("throws notFound for a past date without an entry", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient(null),
    );

    await expect(getEntryDetailData("2026-03-20")).rejects.toThrow("NOT_FOUND");
  });

  it("throws notFound for a future date even if an entry exists", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        body: "미래 테스트 기록",
        entry_date: "2026-03-28",
        location_name: "서울, 대한민국",
        mood_label_snapshot: "평온함",
        paper_tint_code: "mist",
        published_at: "2026-03-28T05:45:00.000Z",
        title: "미래 기록",
        weather_label_snapshot: "맑은 하늘",
      }),
    );

    await expect(getEntryDetailData("2026-03-28")).rejects.toThrow("NOT_FOUND");
  });
});
