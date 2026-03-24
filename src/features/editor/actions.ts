"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { canEditEntryDate, getTodayIsoDate } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DraftSaveInput,
  DraftSaveResult,
  PublishDraftInput,
  PublishDraftResult,
} from "@/features/editor/types";

type DraftAccessContext = {
  entryDate: string;
  existingEntryId: string | null;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  todayIso: string;
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

async function getDraftAccessContext(
  draftId: string,
  userId: string,
): Promise<DraftAccessContext | null> {
  const supabase = await createSupabaseServerClient();

  const [profileResult, draftResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("timezone")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("entry_drafts")
      .select("entry_date, published_entry_id")
      .eq("id", draftId)
      .eq("is_active", true)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  if (!draftResult.data) {
    return null;
  }

  const timezone = profileResult.data?.timezone ?? "Asia/Seoul";
  const todayIso = getTodayIsoDate(timezone);
  const { data: existingEntry } = await supabase
    .from("entries")
    .select("id")
    .eq("user_id", userId)
    .eq("entry_date", draftResult.data.entry_date)
    .maybeSingle();

  return {
    entryDate: draftResult.data.entry_date,
    existingEntryId:
      draftResult.data.published_entry_id ?? existingEntry?.id ?? null,
    supabase,
    todayIso,
  };
}

async function persistDraftChanges(
  input: DraftSaveInput,
  statusLabel: string,
  failureMessage: string,
) {
  const user = await requireUser();
  const accessContext = await getDraftAccessContext(input.draftId, user.id);

  if (!accessContext) {
    return {
      message: failureMessage,
      ok: false as const,
      statusLabel,
    };
  }

  if (
    !canEditEntryDate({
      entryDate: accessContext.entryDate,
      hasEntry: Boolean(accessContext.existingEntryId),
      todayIso: accessContext.todayIso,
    })
  ) {
    return {
      message: "이 날짜의 기록은 수정할 수 없습니다.",
      ok: false as const,
      statusLabel,
    };
  }

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

  const { data, error } = await accessContext.supabase
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
    return {
      message:
        error?.code === "23505"
          ? "이미 같은 날짜의 기록이 존재합니다."
          : "기록 저장에 실패했습니다.",
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
