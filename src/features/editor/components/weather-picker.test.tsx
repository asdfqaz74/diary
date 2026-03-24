import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WeatherPicker } from "@/features/editor/components/weather-picker";

describe("WeatherPicker", () => {
  it("renders weather controls with svg icons instead of ligature text", () => {
    render(
      <WeatherPicker
        onSelect={vi.fn()}
        options={[
          { icon: "wb_sunny", id: "sunny", label: "맑은 하늘" },
          { icon: "cloud", id: "cloud", label: "흐림" },
          { icon: "rainy", id: "rainy", label: "비 오는 날" },
          { icon: "ac_unit", id: "snow", label: "눈 오는 날" },
        ]}
        selectedId="sunny"
      />,
    );

    expect(screen.queryByText("wb_sunny")).toBeNull();
    expect(screen.queryByText("cloud")).toBeNull();
    expect(screen.queryByText("rainy")).toBeNull();
    expect(screen.queryByText("ac_unit")).toBeNull();

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(4);

    buttons.forEach((button) => {
      expect(button.querySelector("svg")).not.toBeNull();
    });
  });

  it("calls onSelect with the clicked weather id", () => {
    const onSelect = vi.fn();

    render(
      <WeatherPicker
        onSelect={onSelect}
        options={[
          { icon: "wb_sunny", id: "sunny", label: "맑은 하늘" },
          { icon: "cloud", id: "cloud", label: "흐림" },
        ]}
        selectedId="sunny"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "흐림" }));

    expect(onSelect).toHaveBeenCalledWith("cloud");
  });

  it("shows a stronger active state for the selected weather", () => {
    render(
      <WeatherPicker
        onSelect={vi.fn()}
        options={[
          { icon: "wb_sunny", id: "sunny", label: "맑은 하늘" },
          { icon: "cloud", id: "cloud", label: "흐림" },
        ]}
        selectedId="cloud"
      />,
    );

    expect(screen.getByRole("button", { name: "흐림" })).toHaveClass(
      "bg-primary-container",
      "ring-2",
    );
    expect(
      screen.getByRole("button", { name: "흐림" }).querySelector("span"),
    ).not.toBeNull();
  });
});
