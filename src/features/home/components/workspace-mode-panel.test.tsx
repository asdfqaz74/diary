import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Providers } from "@/components/providers";
import { WorkspaceModePanel } from "@/features/home/components/workspace-mode-panel";

describe("WorkspaceModePanel", () => {
  it("switches the shared Jotai mode without touching remote data", async () => {
    render(
      <Providers>
        <WorkspaceModePanel />
      </Providers>,
    );

    expect(
      screen.getByRole("heading", { name: "Capture with less friction" }),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Review" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Tighten what deserves to last" }),
      ).toBeVisible();
    });
  });
});
