import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges overlapping Tailwind classes without dropping unrelated values", () => {
    expect(cn("rounded-2xl px-3", ["text-sm", "px-4"], false && "hidden")).toBe(
      "rounded-2xl text-sm px-4",
    );
  });
});
