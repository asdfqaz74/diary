import "server-only";

import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import {
  addDays,
  addMonths,
  endOfMonth,
  formatEnglishDateLabel,
  formatKoreanLongDate,
  formatMonthTitle,
  getDayDifference,
  getKoreanTimeGreeting,
  getTodayIsoDate,
  parseIsoDate,
  startOfMonth,
  toIsoDate,
} from "@/lib/date";
import type { Database } from "@/lib/supabase/database.types";
import type {
  CalendarMonth,
  DashboardData,
  DiaryEntryPreview,
  MoodTrendPoint,
} from "@/features/dashboard/types";

type EntryRow = Database["public"]["Tables"]["entries"]["Row"];

const weekdayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const quotes = [
  {
    author: "무명의 명상가",
    text: "마음이 흔들릴 때 비로소\n내가 보인다.",
  },
  {
    author: "느린 기록가",
    text: "고요함은 답을 주기보다\n질문을 또렷하게 만든다.",
  },
  {
    author: "새벽 산책자",
    text: "짧은 호흡 하나가\n긴 하루를 바꾼다.",
  },
];

function trimExcerpt(value: string, maxLength = 110) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function buildCalendarMonth(
  monthDate: Date,
  entryDates: Set<string>,
  activeDate: string,
): CalendarMonth {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = addDays(monthStart, -monthStart.getUTCDay());
  const gridEnd = addDays(monthEnd, 6 - monthEnd.getUTCDay());
  const days = [];

  for (
    let current = gridStart;
    current <= gridEnd;
    current = addDays(current, 1)
  ) {
    const isoDate = toIsoDate(current);

    days.push({
      dayNumber: current.getUTCDate(),
      hasEntry: entryDates.has(isoDate),
      isActive: isoDate === activeDate,
      isMuted: current.getUTCMonth() !== monthStart.getUTCMonth(),
      key: isoDate,
    });
  }

  return {
    days,
    label: formatMonthTitle(monthStart),
    monthKey: `${monthStart.getUTCFullYear()}-${String(
      monthStart.getUTCMonth() + 1,
    ).padStart(2, "0")}`,
    weekdayLabels,
  };
}

function getRelativeDayLabel(entryDate: string, todayIso: string) {
  const diff = getDayDifference(todayIso, entryDate);

  if (diff === 1) {
    return "어제";
  }

  if (diff === 2) {
    return "그제";
  }

  if (diff <= 7) {
    return `${diff}일 전`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(entryDate));
}

function mapMoodTrend(entries: EntryRow[], todayIso: string): MoodTrendPoint[] {
  return entries.map((entry) => ({
    dayLabel: getRelativeDayLabel(entry.entry_date, todayIso),
    icon:
      entry.mood_score_snapshot >= 75
        ? "sentiment_very_satisfied"
        : entry.mood_score_snapshot >= 45
          ? "sentiment_satisfied"
          : "sentiment_neutral",
    intensity: entry.mood_score_snapshot,
    moodLabel: entry.mood_label_snapshot,
  }));
}

function mapRecentEntries(entries: EntryRow[]): DiaryEntryPreview[] {
  return entries.map((entry) => ({
    dateLabel: formatEnglishDateLabel(entry.entry_date),
    excerpt: trimExcerpt(entry.body),
    icon: entry.is_favorite ? "favorite" : "bookmark",
    title: entry.title || "제목 없는 기록",
  }));
}

function getStreakValue(streakCount: number) {
  if (streakCount > 0) {
    return `${streakCount}일 연속 일기 쓰기 성공!`;
  }

  return "첫 기록을 남겨보세요";
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, timezone")
    .eq("id", user.id)
    .maybeSingle();

  const timezone = profile?.timezone ?? "Asia/Seoul";
  const todayIso = getTodayIsoDate(timezone);
  const currentMonth = startOfMonth(parseIsoDate(todayIso));
  const monthDates = [-1, 0, 1].map((offset) => addMonths(currentMonth, offset));
  const calendarRangeStart = toIsoDate(addDays(startOfMonth(monthDates[0]), -6));
  const calendarRangeEnd = toIsoDate(addDays(endOfMonth(monthDates[2]), 6));

  const [calendarResult, recentResult, moodResult, streakResult] =
    await Promise.all([
      supabase
        .from("entries")
        .select("entry_date")
        .eq("user_id", user.id)
        .gte("entry_date", calendarRangeStart)
        .lte("entry_date", calendarRangeEnd)
        .order("entry_date"),
      supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(2),
      supabase
        .from("entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(7),
      supabase.rpc("calculate_current_streak", {
        p_as_of: todayIso,
        p_user_id: user.id,
      }),
    ]);

  const displayName =
    profile?.display_name ||
    user.user_metadata.full_name ||
    user.email?.split("@")[0] ||
    "기록자";

  const latestWeather =
    recentResult.data?.[0]?.weather_label_snapshot ?? "마음을 들여다보기 좋은 날";
  const streakCount = Number(streakResult.data ?? 0);
  const quote = quotes[streakCount % quotes.length];
  const entryDates = new Set(
    (calendarResult.data ?? []).map((entry) => entry.entry_date),
  );

  return {
    calendarMonths: monthDates.map((monthDate) =>
      buildCalendarMonth(monthDate, entryDates, todayIso),
    ),
    dateLabel: `${formatKoreanLongDate(todayIso, timezone)} · ${latestWeather}`,
    headline: `${getKoreanTimeGreeting(timezone)},\n${displayName}.`,
    moodTrend: mapMoodTrend(moodResult.data ?? [], todayIso),
    quoteAuthor: quote.author,
    quoteText: quote.text,
    recentEntries: mapRecentEntries(recentResult.data ?? []),
    streak: {
      label: "WEEKLY STREAK",
      statLabel: "🔥",
      value: getStreakValue(streakCount),
    },
  };
});
