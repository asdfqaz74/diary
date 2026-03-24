import { afterEach, describe, expect, it, vi } from "vitest";

const {
  createSupabaseServerClientMock,
  requireUserMock,
  updateMock,
} = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  requireUserMock: vi.fn(async () => ({ id: "user-1" })),
  updateMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireUser: requireUserMock,
}));

vi.mock("@/lib/date", () => ({
  formatEnglishWeekdayPeriodForDate: vi.fn(() => "TUESDAY AFTERNOON"),
  formatKoreanEditorDate: vi.fn(() => "2026년 3월 24일"),
  getCurrentKoreanTime: vi.fn(() => "오후 2:45"),
  getTodayIsoDate: vi.fn(() => "2026-03-24"),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

import { getEditorData } from "@/features/editor/lib/get-editor-data";

const activeDraftBase = {
  body: "초안 본문",
  created_at: "2026-03-24T00:00:00.000Z",
  entry_date: "2026-03-24",
  id: "draft-1",
  is_active: true,
  last_autosaved_at: "2026-03-24T00:00:00.000Z",
  location_name: "서울, 대한민국",
  mood_code: "calm",
  mood_label_snapshot: "평온함",
  mood_score_snapshot: 70,
  paper_tint_code: "mist",
  paper_tint_label_snapshot: "미스트",
  published_entry_id: null,
  title: "초안 제목",
  updated_at: "2026-03-24T00:00:00.000Z",
  user_id: "user-1",
  weather_code: "sunny",
  weather_label_snapshot: "맑은 하늘",
};

const entryBase = {
  body: "기존 엔트리 본문",
  created_at: "2026-03-24T00:00:00.000Z",
  entry_date: "2026-03-24",
  id: "entry-1",
  is_favorite: false,
  location_name: "서울, 대한민국",
  mood_code: "calm",
  mood_label_snapshot: "평온함",
  mood_score_snapshot: 70,
  paper_tint_code: "mist",
  paper_tint_label_snapshot: "미스트",
  published_at: "2026-03-24T00:00:00.000Z",
  title: "기존 엔트리 제목",
  updated_at: "2026-03-24T00:00:00.000Z",
  user_id: "user-1",
  weather_code: "sunny",
  weather_label_snapshot: "맑은 하늘",
};

function createMockSupabaseClient(options?: {
  activeDraftSequence?: Array<typeof activeDraftBase | null>;
  existingEntry?: typeof entryBase | null;
  insertResult?: {
    data: typeof activeDraftBase | null;
    error: { code?: string; message?: string } | null;
  };
  repairedDraft?: typeof activeDraftBase;
}) {
  const activeDraftSequence = options?.activeDraftSequence ?? [activeDraftBase];
  const existingEntry =
    options && "existingEntry" in options ? options.existingEntry : entryBase;
  const insertResult = options?.insertResult ?? {
    data: activeDraftBase,
    error: null,
  };
  const repairedDraft = options?.repairedDraft ?? {
    ...activeDraftBase,
    published_entry_id: entryBase.id,
  };

  let activeDraftReadCount = 0;

  updateMock.mockReset();
  updateMock.mockImplementation(() => ({
    eq: () => ({
      eq: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({
              data: repairedDraft,
              error: null,
            }),
          }),
        }),
      }),
    }),
  }));

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

      if (table === "mood_catalog") {
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({
                data: [
                  {
                    code: "calm",
                    display_order: 1,
                    emoji: "🙂",
                    is_active: true,
                    label: "평온함",
                    trend_score: 70,
                  },
                ],
              }),
            }),
          }),
        };
      }

      if (table === "weather_catalog") {
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({
                data: [
                  {
                    code: "sunny",
                    display_order: 1,
                    icon: "wb_sunny",
                    is_active: true,
                    label: "맑은 하늘",
                  },
                ],
              }),
            }),
          }),
        };
      }

      if (table === "paper_tint_catalog") {
        return {
          select: () => ({
            eq: () => ({
              order: async () => ({
                data: [
                  {
                    code: "mist",
                    display_order: 1,
                    is_active: true,
                    label: "미스트",
                    paper_surface_token: "paper",
                    swatch_token: "mist",
                  },
                ],
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
                  data: existingEntry,
                }),
              }),
            }),
          }),
        };
      }

      if (table === "entry_drafts") {
        return {
          insert: () => ({
            select: () => ({
              single: async () => insertResult,
            }),
          }),
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  order: () => ({
                    limit: () => ({
                      maybeSingle: async () => {
                        const data =
                          activeDraftSequence[
                            Math.min(
                              activeDraftReadCount,
                              activeDraftSequence.length - 1,
                            )
                          ] ?? null;

                        activeDraftReadCount += 1;

                        return { data };
                      },
                    }),
                  }),
                }),
              }),
            }),
          }),
          update: updateMock,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    },
  };
}

describe("getEditorData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("repairs a stale active draft by linking it to the existing entry", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        activeDraftSequence: [activeDraftBase],
      }),
    );

    const result = await getEditorData("2026-03-24");

    expect(updateMock).toHaveBeenCalledWith({
      published_entry_id: "entry-1",
    });
    expect(result.draftId).toBe("draft-1");
    expect(result.initialDraft.title).toBe("초안 제목");
    expect(result.entryDate).toBe("2026-03-24");
  });

  it("reuses a just-created active draft after a duplicate insert race", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        activeDraftSequence: [null, activeDraftBase],
        existingEntry: null,
        insertResult: {
          data: null,
          error: {
            code: "23505",
            message: "duplicate key value violates unique constraint",
          },
        },
      }),
    );

    const result = await getEditorData("2026-03-24");

    expect(result.draftId).toBe("draft-1");
    expect(result.initialDraft.title).toBe("초안 제목");
    expect(updateMock).not.toHaveBeenCalled();
  });
});
