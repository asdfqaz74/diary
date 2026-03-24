"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DraftSaveInput,
  DraftSaveResult,
  PublishDraftInput,
  PublishDraftResult,
} from "@/features/editor/types";

type DeleteEntryInput = {
  entryDate: string;
};

type DeleteEntryResult = {
  message?: string;
  ok: boolean;
};

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

function revalidateEntryPaths(entryDate: string) {
  revalidatePath("/");
  revalidatePath(`/entries/${entryDate}`);
  revalidatePath(`/entries/${entryDate}/edit`);
  revalidatePath("/entries/new");
}

async function persistDraftChanges(
  input: DraftSaveInput,
  statusLabel: string,
  failureMessage: string,
) {
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
      ok: false as const,
      statusLabel,
    };
  }

  const { data, error } = await supabase
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
    .eq("user_id", user.id)
    .select("entry_date")
    .maybeSingle();

  if (error || !data) {
    return {
      message: failureMessage,
      ok: false as const,
      statusLabel,
    };
  }

  return {
    entryDate: data.entry_date,
    ok: true as const,
    statusLabel,
  };
}

export async function saveDraftChangesAction(
  input: DraftSaveInput,
): Promise<DraftSaveResult> {
  const result = await persistDraftChanges(
    input,
    "임시저장 실패",
    "임시저장에 실패했습니다.",
  );

  if (!result.ok) {
    return result;
  }

  revalidatePath(`/entries/${result.entryDate}/edit`);

  return {
    ok: true,
    statusLabel: "임시저장됨",
  };
}

export async function saveDraftAction(
  input: PublishDraftInput,
): Promise<PublishDraftResult> {
  const persistedDraft = await persistDraftChanges(
    input,
    "저장 실패",
    "기록 저장에 실패했습니다.",
  );

  if (!persistedDraft.ok) {
    return {
      message: persistedDraft.message,
      ok: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: entryId, error } = await supabase.rpc("save_entry_from_draft", {
    p_draft_id: input.draftId,
  });

  if (error || !entryId) {
    const message =
      error?.code === "23505"
        ? "이미 같은 날짜의 기록이 존재합니다."
        : "기록 저장에 실패했습니다.";

    return {
      message,
      ok: false,
    };
  }

  revalidateEntryPaths(persistedDraft.entryDate);

  return {
    ok: true,
    redirectTo: `/entries/${persistedDraft.entryDate}`,
  };
}

export async function publishDraftAction(
  input: PublishDraftInput,
): Promise<PublishDraftResult> {
  return saveDraftAction(input);
}

export async function deleteEntryAction(
  input: DeleteEntryInput,
): Promise<DeleteEntryResult> {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("delete_entry_for_date", {
    p_entry_date: input.entryDate,
  });

  if (error) {
    return {
      message: "기록 삭제에 실패했습니다.",
      ok: false,
    };
  }

  revalidateEntryPaths(input.entryDate);

  return {
    ok: true,
  };
}
