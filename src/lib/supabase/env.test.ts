import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getSupabasePublicEnv,
  requireSupabasePublicEnv,
} from "@/lib/supabase/env";

describe("supabase env", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers the publishable key when both keys are present", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "pk-live");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-anon");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");

    expect(getSupabasePublicEnv()).toEqual({
      appUrl: "http://localhost:3000",
      publishableKey: "pk-live",
      url: "https://example.supabase.co",
    });
  });

  it("falls back to the legacy anon key when publishable key is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "legacy-anon");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");

    expect(getSupabasePublicEnv()).toEqual({
      appUrl: "http://localhost:3000",
      publishableKey: "legacy-anon",
      url: "https://example.supabase.co",
    });
  });

  it("throws with the publishable key message when env is missing", () => {
    expect(() => requireSupabasePublicEnv()).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/,
    );
  });
});
