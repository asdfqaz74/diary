import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("dashboard page", () => {
  it("renders the dashboard mock content and moves between calendar months", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", { name: /평온한 오후입니다,\s*진수님\./ }),
    ).toBeVisible();
    expect(screen.getByText("7일 연속 일기 쓰기 성공!")).toBeVisible();
    expect(screen.getByRole("heading", { name: "최근 기록들" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "5월의 기록" })).toBeVisible();
    expect(screen.getByLabelText("선택된 날짜 24일")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "다음 달 보기" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "6월의 기록" })).toBeVisible();
    });

    expect(screen.getByLabelText("선택된 날짜 18일")).toBeVisible();
  });
});
