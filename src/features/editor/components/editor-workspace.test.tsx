import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EditorWorkspace } from "@/features/editor/components/editor-workspace";
import type { EditorData } from "@/features/editor/types";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/features/editor/components/mood-picker", () => ({
  MoodPicker: () => <div data-testid="mood-picker" />,
}));

vi.mock("@/features/editor/components/paper-tint-picker", () => ({
  PaperTintPicker: () => <div data-testid="paper-tint-picker" />,
}));

vi.mock("@/features/editor/components/weather-picker", () => ({
  WeatherPicker: () => <div data-testid="weather-picker" />,
}));

const baseEditorData: EditorData = {
  dateLabel: "2026년 3월 24일",
  draftId: "draft-1",
  entryDate: "2026-03-24",
  initialDraft: {
    body: "기존 본문",
    moodId: "calm",
    tintId: "mist",
    title: "기존 제목",
    weatherId: "clear",
  },
  meta: {
    initialStatusLabel: "불러옴",
    locationLabel: "서울, 대한민국",
    timeLabel: "오후 2:45",
  },
  moodOptions: [{ emoji: "🙂", id: "calm", label: "평온함" }],
  paperTintOptions: [
    {
      editorClassName: "bg-white/92",
      id: "mist",
      label: "미스트",
      swatchClassName: "bg-surface-container-lowest",
    },
  ],
  subtitle: "TUESDAY AFTERNOON",
  titlePlaceholder: "오늘의 제목...",
  weatherOptions: [{ icon: "clear_day", id: "clear", label: "맑음" }],
  writingPlaceholder: "여기에 당신의 마음을 적어보세요...",
};

describe("EditorWorkspace", () => {
  afterEach(() => {
    vi.useRealTimers();
    mockPush.mockReset();
    mockRefresh.mockReset();
  });

  it("does not call draft save automatically when fields change", () => {
    vi.useFakeTimers();

    const saveDraftChanges = vi.fn(async () => ({
      ok: true,
      statusLabel: "임시저장됨",
    }));

    render(
      <EditorWorkspace
        {...baseEditorData}
        saveDraft={vi.fn(async () => ({ ok: true }))}
        saveDraftChanges={saveDraftChanges}
      />,
    );

    fireEvent.change(screen.getByLabelText("제목"), {
      target: { value: "수정한 제목" },
    });
    fireEvent.change(screen.getByLabelText("본문"), {
      target: { value: "수정한 본문" },
    });

    vi.advanceTimersByTime(3000);

    expect(saveDraftChanges).not.toHaveBeenCalled();
  });

  it("saves the current draft when 임시저장 is clicked", async () => {
    const saveDraftChanges = vi.fn(async () => ({
      ok: true,
      statusLabel: "임시저장됨",
    }));

    render(
      <EditorWorkspace
        {...baseEditorData}
        saveDraft={vi.fn(async () => ({ ok: true }))}
        saveDraftChanges={saveDraftChanges}
      />,
    );

    fireEvent.change(screen.getByLabelText("제목"), {
      target: { value: "임시 제목" },
    });

    fireEvent.click(screen.getByRole("button", { name: "임시저장" }));

    await waitFor(() => {
      expect(saveDraftChanges).toHaveBeenCalledWith({
        body: "기존 본문",
        draftId: "draft-1",
        moodId: "calm",
        tintId: "mist",
        title: "임시 제목",
        weatherId: "clear",
      });
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("persists current draft values and navigates to detail on 저장하기", async () => {
    const saveDraft = vi.fn(async () => ({
      ok: true,
      redirectTo: "/entries/2026-03-24",
    }));

    render(
      <EditorWorkspace
        {...baseEditorData}
        saveDraft={saveDraft}
        saveDraftChanges={vi.fn(async () => ({
          ok: true,
          statusLabel: "임시저장됨",
        }))}
      />,
    );

    fireEvent.change(screen.getByLabelText("본문"), {
      target: { value: "최종 저장할 본문" },
    });

    fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(saveDraft).toHaveBeenCalledWith({
        body: "최종 저장할 본문",
        draftId: "draft-1",
        moodId: "calm",
        tintId: "mist",
        title: "기존 제목",
        weatherId: "clear",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/entries/2026-03-24");
    expect(mockRefresh).toHaveBeenCalled();
  });
});
