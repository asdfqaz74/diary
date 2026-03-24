import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockNotFound, mockEditorScreen } = vi.hoisted(() => ({
  mockEditorScreen: vi.fn(({ entryDate }: { entryDate: string }) => (
    <div>editor:{entryDate}</div>
  )),
  mockNotFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

vi.mock("@/features/editor/components/editor-screen", () => ({
  EditorScreen: mockEditorScreen,
}));

import EntryEditPage from "@/app/entries/[date]/edit/page";

describe("entry edit page", () => {
  it("renders the editor for a valid date", async () => {
    render(
      await EntryEditPage({
        params: Promise.resolve({ date: "2026-03-24" }),
      }),
    );

    expect(screen.getByText("editor:2026-03-24")).toBeVisible();
  });

  it("throws notFound for an invalid date segment", async () => {
    await expect(
      EntryEditPage({
        params: Promise.resolve({ date: "invalid-date" }),
      }),
    ).rejects.toThrow("NOT_FOUND");
  });
});
