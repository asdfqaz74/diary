import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/ui/app-shell";

let mockedPathname = "/";
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockedPathname,
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

describe("AppShell", () => {
  it("highlights the records navigation and shows the dashboard fab on home", () => {
    mockedPathname = "/";

    const { container } = render(
      <AppShell>
        <div>dashboard body</div>
      </AppShell>,
    );

    expect(container.querySelectorAll('a[href="/"][aria-current="page"]')).toHaveLength(2);
    expect(container.querySelectorAll('a[href="/entries/new"]')).toHaveLength(3);
  });

  it("keeps the records navigation active on a date detail route", () => {
    mockedPathname = "/entries/2026-03-24";

    const { container } = render(
      <AppShell>
        <div>detail body</div>
      </AppShell>,
    );

    expect(container.querySelectorAll('a[href="/"][aria-current="page"]')).toHaveLength(2);
    expect(container.querySelector('a[href="/entries/new"][aria-current="page"]')).toBeNull();
  });

  it("moves active navigation to compose on the dated editor route", () => {
    mockedPathname = "/entries/2026-03-24/edit";

    const { container } = render(
      <AppShell>
        <div>editor body</div>
      </AppShell>,
    );

    expect(container.querySelectorAll('a[href="/entries/new"][aria-current="page"]')).toHaveLength(2);
    expect(container.querySelectorAll('a[href="/entries/new"]')).toHaveLength(2);
  });

  it("renders auth routes without navigation chrome", () => {
    mockedPathname = "/login";

    const { container } = render(
      <AppShell>
        <div>login body</div>
      </AppShell>,
    );

    expect(screen.getByText("login body")).toBeVisible();
    expect(container.querySelector('a[href="/"]')).toBeNull();
    expect(container.querySelector('a[href="/entries/new"]')).toBeNull();
  });
});
