import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import {
  formatEnglishWeekdayPeriod,
  formatKoreanEditorDate,
  getCurrentKoreanTime,
  getTodayIsoDate,
} from "@/lib/date";
import type { Database } from "@/lib/supabase/database.types";
import type {
  EditorData,
  MoodOption,
  PaperTintOption,
  WeatherOption,
} from "@/features/editor/types";

type DraftRow = Database["public"]["Tables"]["entry_drafts"]["Row"];
type MoodCatalogRow = Database["public"]["Tables"]["mood_catalog"]["Row"];
type WeatherCatalogRow = Database["public"]["Tables"]["weather_catalog"]["Row"];
type PaperTintCatalogRow =
  Database["public"]["Tables"]["paper_tint_catalog"]["Row"];

const tintClassMap: Record<
  string,
  Pick<PaperTintOption, "editorClassName" | "swatchClassName">
> = {
  mist: {
    editorClassName: "bg-white/92",
    swatchClassName: "bg-surface-container-lowest",
  },
  rose: {
    editorClassName: "bg-rose-50/90",
    swatchClassName: "bg-rose-100",
  },
  sage: {
    editorClassName: "bg-emerald-50/88",
    swatchClassName: "bg-emerald-100",
  },
  sky: {
    editorClassName: "bg-sky-50/88",
    swatchClassName: "bg-sky-100",
  },
};

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
    editorClassName: tintClassMap[row.code]?.editorClassName ?? "bg-white/92",
    id: row.code,
    label: row.label,
    swatchClassName:
      tintClassMap[row.code]?.swatchClassName ?? "bg-surface-container-lowest",
  }));
}

async function getOrCreateActiveDraft(
  userId: string,
  timezone: string,
  moods: MoodCatalogRow[],
  weathers: WeatherCatalogRow[],
  tints: PaperTintCatalogRow[],
) {
  const supabase = await createSupabaseServerClient();
  const { data: existingDraft } = await supabase
    .from("entry_drafts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingDraft) {
    return existingDraft;
  }

  const defaultMood = moods[0];
  const defaultWeather = weathers[0];
  const defaultTint = tints[0];

  if (!defaultMood || !defaultWeather || !defaultTint) {
    throw new Error("Catalog data is not seeded yet.");
  }

  const entryDate = getTodayIsoDate(timezone);

  const insertResult = await supabase
    .from("entry_drafts")
    .insert({
      body: "",
      entry_date: entryDate,
      location_name: "서울, 대한민국",
      mood_code: defaultMood.code,
      mood_label_snapshot: defaultMood.label,
      mood_score_snapshot: defaultMood.trend_score,
      paper_tint_code: defaultTint.code,
      paper_tint_label_snapshot: defaultTint.label,
      title: "",
      user_id: userId,
      weather_code: defaultWeather.code,
      weather_label_snapshot: defaultWeather.label,
    })
    .select("*")
    .single();

  if (!insertResult.error && insertResult.data) {
    return insertResult.data;
  }

  const { data: duplicateDraft } = await supabase
    .from("entry_drafts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!duplicateDraft) {
    throw insertResult.error;
  }

  return duplicateDraft;
}

function toEditorData(
  draft: DraftRow,
  moods: MoodCatalogRow[],
  weathers: WeatherCatalogRow[],
  tints: PaperTintCatalogRow[],
  timezone: string,
): EditorData {
  return {
    dateLabel: formatKoreanEditorDate(draft.entry_date, timezone),
    draftId: draft.id,
    initialDraft: {
      body: draft.body,
      moodId: draft.mood_code,
      tintId: draft.paper_tint_code,
      title: draft.title,
      weatherId: draft.weather_code,
    },
    meta: {
      initialStatusLabel: "초안 불러옴",
      locationLabel: draft.location_name ?? "서울, 대한민국",
      timeLabel: getCurrentKoreanTime(timezone),
    },
    moodOptions: mapMoodOptions(moods),
    paperTintOptions: mapTintOptions(tints),
    subtitle: formatEnglishWeekdayPeriod(timezone),
    titlePlaceholder: "오늘의 제목...",
    weatherOptions: mapWeatherOptions(weathers),
    writingPlaceholder: "이곳에 당신의 진심을 담아보세요...",
  };
}

export async function getEditorData(): Promise<EditorData> {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const [profileResult, moodResult, weatherResult, tintResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("timezone")
        .eq("id", user.id)
        .maybeSingle(),
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
    ]);

  const timezone = profileResult.data?.timezone ?? "Asia/Seoul";
  const moods = moodResult.data ?? [];
  const weathers = weatherResult.data ?? [];
  const tints = tintResult.data ?? [];

  const draft = await getOrCreateActiveDraft(
    user.id,
    timezone,
    moods,
    weathers,
    tints,
  );

  return toEditorData(draft, moods, weathers, tints, timezone);
}
