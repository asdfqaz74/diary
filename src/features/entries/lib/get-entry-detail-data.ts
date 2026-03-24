import "server-only";

import { notFound } from "next/navigation";
import { cache } from "react";
import { requireUser } from "@/lib/auth";
import {
  canViewEntryDate,
  formatEnglishWeekdayPeriodForDate,
  formatKoreanEditorDate,
  getTodayIsoDate,
} from "@/lib/date";
import { getPaperTintClasses } from "@/lib/paper-tint";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EntryDetailData } from "@/features/entries/types";

function formatSavedAtLabel(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    month: "long",
    day: "numeric",
    timeZone,
  }).format(new Date(value));
}

export const getEntryDetailData = cache(
  async (entryDate: string): Promise<EntryDetailData> => {
    const user = await requireUser();
    const supabase = await createSupabaseServerClient();

    const [profileResult, entryResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("timezone")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", entryDate)
        .maybeSingle(),
    ]);

    const timezone = profileResult.data?.timezone ?? "Asia/Seoul";
    const todayIso = getTodayIsoDate(timezone);
    const hasEntry = Boolean(entryResult.data);

    if (
      !canViewEntryDate({
        entryDate,
        hasEntry,
        todayIso,
      })
    ) {
      notFound();
    }

    const dateLabel = formatKoreanEditorDate(entryDate, timezone);
    const subtitle = formatEnglishWeekdayPeriodForDate(entryDate, timezone);
    const editHref = `/entries/${entryDate}/edit`;

    if (!entryResult.data) {
      return {
        dateLabel,
        editHref,
        entryDate,
        kind: "empty",
        subtitle,
      };
    }

    return {
      body: entryResult.data.body,
      dateLabel,
      editHref,
      entryDate,
      kind: "entry",
      locationLabel: entryResult.data.location_name ?? "서울, 대한민국",
      moodLabel: entryResult.data.mood_label_snapshot,
      paperClassName: getPaperTintClasses(entryResult.data.paper_tint_code)
        .editorClassName,
      savedAtLabel: formatSavedAtLabel(entryResult.data.published_at, timezone),
      subtitle,
      title: entryResult.data.title,
      weatherLabel: entryResult.data.weather_label_snapshot,
    };
  },
);
