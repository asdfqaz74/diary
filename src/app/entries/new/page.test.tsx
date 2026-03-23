import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NewEntryPage from "@/app/entries/new/page";

describe("new entry page", () => {
  it("updates the draft state, picker state, and mock save status", async () => {
    render(await NewEntryPage());

    const titleInput = screen.getByLabelText("제목");
    const bodyTextarea = screen.getByLabelText("본문");

    expect(titleInput).toBeVisible();
    expect(bodyTextarea).toBeVisible();

    fireEvent.change(titleInput, { target: { value: "저녁 호흡 기록" } });
    fireEvent.change(bodyTextarea, {
      target: { value: "호흡을 세며 마음이 잦아드는 순간을 적어본다." },
    });

    expect(screen.getByDisplayValue("저녁 호흡 기록")).toBeVisible();
    expect(screen.getByText("변경 사항 있음")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "가라앉은 기분" }));
    fireEvent.click(screen.getByRole("button", { name: "비 오는 날씨" }));
    fireEvent.click(screen.getByRole("button", { name: "잔잔한 장밋빛 용지" }));

    expect(
      screen.getByRole("button", { name: "가라앉은 기분" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "비 오는 날씨" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "잔잔한 장밋빛 용지" }),
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(screen.getByText("방금 저장됨")).toBeVisible();
    });
  });
});
