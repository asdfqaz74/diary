import "server-only";

import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  canEditEntryDate,
  formatEnglishWeekdayPeriodForDate,
  formatKoreanEditorDate,
  getCurrentKoreanTime,
  getTodayIsoDate,
} from "@/lib/date";
import { getPaperTintClasses } from "@/lib/paper-tint";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  EditorData,
  MoodOption,
  PaperTintOption,
  WeatherOption,
} from "@/features/editor/types";

type DraftRow = Database["public"]["Tables"]["entry_drafts"]["Row"];
type EntryRow = Database["public"]["Tables"]["entries"]["Row"];
type MoodCatalogRow = Database["public"]["Tables"]["mood_catalog"]["Row"];
type WeatherCatalogRow = Database["public"]["Tables"]["weather_catalog"]["Row"];
type PaperTintCatalogRow =
  Database["public"]["Tables"]["paper_tint_catalog"]["Row"];

type Catalogs = {
  moods: MoodCatalogRow[];
  tints: PaperTintCatalogRow[];
  weathers: WeatherCatalogRow[];
};

const draftLookupRetryDelaysMs = [0, 25, 75, 150, 250] as const;

function mapMoodOptions(rows: MoodCatalogRow[]): MoodOption[] {
  return rows.map((row) => ({
    emoji: row.emoji,
    id: row.code,
    label: row.label,
  }));
}

function mapWeatherOptions(rows: WeatherCatalogRow[]): WeatherOption[] {
  return rows.map((row) => ({
    icon: row.icon,
    id: row.code,
    label: row.label,
  }));
}

function mapTintOptions(rows: PaperTintCatalogRow[]): PaperTintOption[] {
  return rows.map((row) => ({
    editorClassName: getPaperTintClasses(row.code).editorClassName,
    id: row.code,
    label: row.label,
    swatchClassName: getPaperTintClasses(row.code).swatchClassName,
  }));
}

function getCatalogDefaults(catalogs: Catalogs) {
  const defaultMood = catalogs.moods[0];
  const defaultWeather = catalogs.weathers[0];
  const defaultTint = catalogs.tints[0];

  if (!defaultMood || !defaultWeather || !defaultTint) {
    throw new Error("Catalog data is not seeded yet.");
  }

  return {
    defaultMood,
    defaultTint,
    defaultWeather,
  };
}

async function getActiveDraftForDate(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  entryDate: string,
) {
  const { data } = await supabase
    .from("entry_drafts")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ?? null;
}

async function getEntryForDate(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  entryDate: string,
) {
  const { data } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .maybeSingle();

  return data ?? null;
}

async function repairDraftEntryLink(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  draft: DraftRow,
  existingEntry: EntryRow | null,
) {
  if (!existingEntry || draft.published_entry_id) {
    return draft;
  }

  const { data, error } = await supabase
    .from("entry_drafts")
    .update({
      published_entry_id: existingEntry.id,
    })
    .eq("id", draft.id)
    .eq("user_id", userId)
    .eq("is_active", true)
    .select("*")
    .single();

  if (error || !data) {
    return {
      ...draft,
      published_entry_id: existingEntry.id,
    };
  }

  return data as DraftRow;
}

async function createDraftForDate(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  entryDate: string,
  catalogs: Catalogs,
  sourceEntry?: EntryRow | null,
) {
  const defaults = getCatalogDefaults(catalogs);
  const entry = sourceEntry ?? null;

  const insertResult = await supabase
    .from("entry_drafts")
    .insert({
      body: entry?.body ?? "",
      entry_date: entryDate,
      is_active: true,
      location_name: entry?.location_name ?? "서울, 대한민국",
      mood_code: entry?.mood_code ?? defaults.defaultMood.code,
      mood_label_snapshot:
        entry?.mood_label_snapshot ?? defaults.defaultMood.label,
      mood_score_snapshot:
        entry?.mood_score_snapshot ?? defaults.defaultMood.trend_score,
      paper_tint_code: entry?.paper_tint_code ?? defaults.defaultTint.code,
      paper_tint_label_snapshot:
        entry?.paper_tint_label_snapshot ?? defaults.defaultTint.label,
      published_entry_id: entry?.id ?? null,
      title: entry?.title ?? "",
      user_id: userId,
      weather_code: entry?.weather_code ?? defaults.defaultWeather.code,
      weather_label_snapshot:
        entry?.weather_label_snapshot ?? defaults.defaultWeather.label,
    })
    .select("*")
    .single();

  if (!insertResult.error && insertResult.data) {
    return insertResult.data as DraftRow;
  }

  const duplicateDraft = await findDuplicateDraftAfterConflict(
    supabase,
    userId,
    entryDate,
  );

  if (duplicateDraft) {
    return repairDraftEntryLink(supabase, userId, duplicateDraft, entry);
  }

  throw insertResult.error;
}

async function findDuplicateDraftAfterConflict(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  entryDate: string,
) {
  for (const delayMs of draftLookupRetryDelaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }

    const duplicateDraft = await getActiveDraftForDate(supabase, userId, entryDate);

    if (duplicateDraft) {
      return duplicateDraft;
    }
  }

  return null;
}

function toEditorData(
  draft: DraftRow,
  catalogs: Catalogs,
  timezone: string,
): EditorData {
  return {
    dateLabel: formatKoreanEditorDate(draft.entry_date, timezone),
    draftId: draft.id,
    entryDate: draft.entry_date,
    initialDraft: {
      body: draft.body,
      moodId: draft.mood_code,
      tintId: draft.paper_tint_code,
      title: draft.title,
      weatherId: draft.weather_code,
    },
    meta: {
      initialStatusLabel: "불러옴",
      locationLabel: draft.location_name ?? "서울, 대한민국",
      timeLabel: getCurrentKoreanTime(timezone),
    },
    moodOptions: mapMoodOptions(catalogs.moods),
    paperTintOptions: mapTintOptions(catalogs.tints),
    subtitle: formatEnglishWeekdayPeriodForDate(draft.entry_date, timezone),
    titlePlaceholder: "오늘의 제목...",
    weatherOptions: mapWeatherOptions(catalogs.weathers),
    writingPlaceholder: "이곳에 당신의 진심을 담아보세요...",
  };
}

export async function getEditorData(
  selectedDate?: string,
): Promise<EditorData> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();

  const timezone = profile?.timezone ?? "Asia/Seoul";
  const todayIso = getTodayIsoDate(timezone);
  const entryDate = selectedDate ?? todayIso;

  const [moodResult, weatherResult, tintResult, activeDraft, existingEntry] =
    await Promise.all([
      supabase
        .from("mood_catalog")
        .select("*")
        .eq("is_active", true)
        .order("display_order"),
      supabase
        .from("weather_catalog")
        .select("*")
        .eq("is_active", true)
        .order("display_order"),
      supabase
        .from("paper_tint_catalog")
        .select("*")
        .eq("is_active", true)
        .order("display_order"),
      getActiveDraftForDate(supabase, user.id, entryDate),
      getEntryForDate(supabase, user.id, entryDate),
    ]);

  if (
    !canEditEntryDate({
      entryDate,
      hasEntry: Boolean(existingEntry),
      todayIso,
    })
  ) {
    notFound();
  }

  const catalogs: Catalogs = {
    moods: moodResult.data ?? [],
    tints: tintResult.data ?? [],
    weathers: weatherResult.data ?? [],
  };

  if (activeDraft) {
    const repairedDraft = await repairDraftEntryLink(
      supabase,
      user.id,
      activeDraft,
      existingEntry,
    );

    return toEditorData(repairedDraft, catalogs, timezone);
  }

  const draft = await createDraftForDate(
    supabase,
    user.id,
    entryDate,
    catalogs,
    existingEntry,
  );

  return toEditorData(draft, catalogs, timezone);
}
