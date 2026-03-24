import { afterEach, describe, expect, it, vi } from "vitest";

const {
  createSupabaseServerClientMock,
  requireUserMock,
} = vi.hoisted(() => ({
  createSupabaseServerClientMock: vi.fn(),
  requireUserMock: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
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
    getTodayIsoDate: vi.fn(() => "2026-03-24"),
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

import {
  saveDraftAction,
  saveDraftChangesAction,
} from "@/features/editor/actions";

function createMockSupabaseClient(options: {
  draftEntryDate: string;
  existingEntryId: string | null;
  publishedEntryId?: string | null;
}) {
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

      if (table === "entry_drafts") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                eq: () => ({
                  maybeSingle: async () => ({
                    data: {
                      entry_date: options.draftEntryDate,
                      published_entry_id: options.publishedEntryId ?? null,
                    },
                  }),
                }),
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
                  data: options.existingEntryId
                    ? { id: options.existingEntryId }
                    : null,
                }),
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    },
    rpc: vi.fn(),
  };
}

const draftInput = {
  body: "본문",
  draftId: "draft-1",
  moodId: "calm",
  tintId: "mist",
  title: "제목",
  weatherId: "sunny",
};

describe("editor actions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("blocks manual draft save for a past date without an existing entry", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        draftEntryDate: "2026-03-20",
        existingEntryId: null,
      }),
    );

    const result = await saveDraftChangesAction(draftInput);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("이 날짜의 기록은 수정할 수 없습니다.");
  });

  it("blocks final save for a future draft even if old test data exists", async () => {
    createSupabaseServerClientMock.mockResolvedValue(
      createMockSupabaseClient({
        draftEntryDate: "2026-03-28",
        existingEntryId: "future-entry-1",
        publishedEntryId: "future-entry-1",
      }),
    );

    const result = await saveDraftAction(draftInput);

    expect(result.ok).toBe(false);
    expect(result.message).toBe("이 날짜의 기록은 수정할 수 없습니다.");
  });
});
