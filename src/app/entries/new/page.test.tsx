import { describe, expect, it, vi } from "vitest";

const { mockRedirect } = vi.hoisted(() => ({
  mockRedirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("@/lib/auth", () => ({
  requireUser: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("@/lib/date", () => ({
  getTodayIsoDate: vi.fn(() => "2026-03-23"),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    from: () => ({
      eq: () => ({
        maybeSingle: async () => ({
          data: {
            timezone: "Asia/Seoul",
          },
        }),
      }),
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              timezone: "Asia/Seoul",
            },
          }),
        }),
      }),
    }),
  })),
}));

import NewEntryPage from "@/app/entries/new/page";

describe("/entries/new page", () => {
  it("redirects to today's edit route", async () => {
    await NewEntryPage();

    expect(mockRedirect).toHaveBeenCalledWith("/entries/2026-03-23/edit");
  });
});
