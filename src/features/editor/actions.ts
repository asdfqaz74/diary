"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AutosaveDraftInput,
  AutosaveDraftResult,
  PublishDraftInput,
  PublishDraftResult,
} from "@/features/editor/types";

async function getCatalogSnapshots(
  moodId: string,
  weatherId: string,
  tintId: string,
) {
  const supabase = await createSupabaseServerClient();

  const [moodResult, weatherResult, tintResult] = await Promise.all([
    supabase
      .from("mood_catalog")
      .select("code, label, trend_score")
      .eq("code", moodId)
      .single(),
    supabase
      .from("weather_catalog")
      .select("code, label")
      .eq("code", weatherId)
      .single(),
    supabase
      .from("paper_tint_catalog")
      .select("code, label")
      .eq("code", tintId)
      .single(),
  ]);

  if (moodResult.error || weatherResult.error || tintResult.error) {
    return null;
  }

  return {
    mood: moodResult.data,
    tint: tintResult.data,
    weather: weatherResult.data,
  };
}

export async function autosaveDraftAction(
  input: AutosaveDraftInput,
): Promise<AutosaveDraftResult> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const snapshots = await getCatalogSnapshots(
    input.moodId,
    input.weatherId,
    input.tintId,
  );

  if (!snapshots) {
    return {
      message: "선택한 메타데이터를 찾을 수 없습니다.",
      ok: false,
      statusLabel: "자동 저장 실패",
    };
  }

  const { error } = await supabase
    .from("entry_drafts")
    .update({
      body: input.body,
      last_autosaved_at: new Date().toISOString(),
      mood_code: snapshots.mood.code,
      mood_label_snapshot: snapshots.mood.label,
      mood_score_snapshot: snapshots.mood.trend_score,
      paper_tint_code: snapshots.tint.code,
      paper_tint_label_snapshot: snapshots.tint.label,
      title: input.title,
      weather_code: snapshots.weather.code,
      weather_label_snapshot: snapshots.weather.label,
    })
    .eq("id", input.draftId)
    .eq("is_active", true)
    .eq("user_id", user.id);

  if (error) {
    return {
      message: "초안 자동 저장에 실패했습니다.",
      ok: false,
      statusLabel: "자동 저장 실패",
    };
  }

  return {
    ok: true,
    statusLabel: "자동 저장됨",
  };
}

export async function publishDraftAction(
  input: PublishDraftInput,
): Promise<PublishDraftResult> {
  await requireUser();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("publish_entry_from_draft", {
    p_draft_id: input.draftId,
  });

  if (error) {
    const message =
      error.code === "23505"
        ? "오늘 기록은 이미 저장되었습니다."
        : "기록 저장에 실패했습니다.";

    return {
      message,
      ok: false,
    };
  }

  revalidatePath("/");
  revalidatePath("/entries/new");

  return {
    ok: true,
    redirectTo: "/",
  };
}
