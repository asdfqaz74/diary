import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  autosaveDraftAction,
  mockPush,
  mockRefresh,
  publishDraftAction,
} = vi.hoisted(() => ({
  autosaveDraftAction: vi.fn(async () => ({
    ok: true,
    statusLabel: "자동 저장됨",
  })),
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  publishDraftAction: vi.fn(async () => ({
    ok: true,
    redirectTo: "/",
  })),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>(
    "next/navigation",
  );

  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
      refresh: mockRefresh,
    }),
  };
});

vi.mock("@/features/editor/lib/get-editor-data", () => ({
  getEditorData: vi.fn(async () => ({
    dateLabel: "2026년 3월 23일",
    draftId: "draft-1",
    initialDraft: {
      body: "",
      moodId: "meditative",
      tintId: "mist",
      title: "",
      weatherId: "cloud",
    },
    meta: {
      initialStatusLabel: "초안 불러옴",
      locationLabel: "서울, 대한민국",
      timeLabel: "오후 2:45",
    },
    moodOptions: [
      { emoji: "🧘", id: "meditative", label: "명상하는 마음" },
      { emoji: "🙂", id: "calm", label: "평온함" },
      { emoji: "😌", id: "quiet", label: "차분함" },
    ],
    paperTintOptions: [
      {
        editorClassName: "bg-white/92",
        id: "mist",
        label: "안개빛 종이",
        swatchClassName: "bg-surface-container-lowest",
      },
      {
        editorClassName: "bg-rose-50/90",
        id: "rose",
        label: "장밋빛 종이",
        swatchClassName: "bg-rose-100",
      },
    ],
    subtitle: "MONDAY AFTERNOON",
    titlePlaceholder: "오늘의 제목...",
    weatherOptions: [
      { icon: "wb_sunny", id: "sunny", label: "맑은 하늘" },
      { icon: "cloud", id: "cloud", label: "흐림" },
      { icon: "rainy", id: "rainy", label: "비 오는 날" },
    ],
    writingPlaceholder: "이곳에 당신의 진심을 담아보세요...",
  })),
}));

vi.mock("@/features/editor/actions", () => ({
  autosaveDraftAction,
  publishDraftAction,
}));

import NewEntryPage from "@/app/entries/new/page";

describe("new entry page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockPush.mockReset();
    mockRefresh.mockReset();
    autosaveDraftAction.mockClear();
    publishDraftAction.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates draft state, picker state, autosaves, and publishes", async () => {
    render(await NewEntryPage());

    const titleInput = screen.getByLabelText("제목");
    const bodyTextarea = screen.getByLabelText("본문");

    fireEvent.change(titleInput, { target: { value: "오늘의 호흡 기록" } });
    fireEvent.change(bodyTextarea, {
      target: { value: "천천히 호흡을 세며 마음의 속도를 낮췄다." },
    });

    expect(screen.getByDisplayValue("오늘의 호흡 기록")).toBeVisible();
    expect(screen.getByText("변경 사항 있음")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "차분함" }));
    fireEvent.click(screen.getByRole("button", { name: "비 오는 날" }));
    fireEvent.click(screen.getByRole("button", { name: "장밋빛 종이" }));

    expect(
      screen.getByRole("button", { name: "차분함" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "비 오는 날" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "장밋빛 종이" }),
    ).toHaveAttribute("aria-pressed", "true");

    await act(async () => {
      vi.advanceTimersByTime(900);
      await Promise.resolve();
    });

    expect(autosaveDraftAction).toHaveBeenCalled();

    expect(screen.getByText("자동 저장됨")).toBeVisible();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "저장하기" }));
      await Promise.resolve();
    });

    expect(publishDraftAction).toHaveBeenCalledWith({ draftId: "draft-1" });
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalled();
  });
});
