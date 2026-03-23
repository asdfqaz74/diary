import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Providers } from "@/components/providers";
import { LivePromptCard } from "@/features/home/components/live-prompt-card";

describe("LivePromptCard", () => {
  it("renders server data through the shared query provider", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        generatedAt: "2026-03-23T03:00:00.000Z",
        lens: "Attention",
        prompt:
          "Name the detail you almost skipped today, then explain why it deserves a full paragraph.",
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <Providers>
        <LivePromptCard />
      </Providers>,
    );

    expect(screen.getByRole("heading", { name: "Fresh prompt" })).toBeVisible();

    expect(
      await screen.findByText(
        "Name the detail you almost skipped today, then explain why it deserves a full paragraph.",
      ),
    ).toBeVisible();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
