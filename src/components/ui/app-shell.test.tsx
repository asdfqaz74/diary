import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/ui/app-shell";

let mockedPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
}));

describe("AppShell", () => {
  it("highlights the dashboard navigation and shows the compose fab on home", () => {
    mockedPathname = "/";

    render(
      <AppShell>
        <div>dashboard body</div>
      </AppShell>,
    );

    expect(
      screen.getByRole("link", { name: "사이드바: 내 일기" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "하단 탐색: 기록" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "오늘의 일기" })).toBeVisible();
  });

  it("moves active navigation to compose on the editor route", () => {
    mockedPathname = "/entries/new";

    render(
      <AppShell>
        <div>editor body</div>
      </AppShell>,
    );

    expect(
      screen.getByRole("link", { name: "사이드바: 새 일기 쓰기" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      screen.getByRole("link", { name: "하단 탐색: 쓰기" }),
    ).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "오늘의 일기" })).toBeNull();
  });

  it("renders auth routes without navigation chrome", () => {
    mockedPathname = "/login";

    render(
      <AppShell>
        <div>login body</div>
      </AppShell>,
    );

    expect(screen.getByText("login body")).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "사이드바: 내 일기" }),
    ).toBeNull();
    expect(screen.queryByRole("link", { name: "오늘의 일기" })).toBeNull();
  });
});
