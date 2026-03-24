import "server-only";

import { cache } from "react";
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
import { getPaperTintClasses } from "@/lib/paper-tint";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
    text: "마음이 흔들릴 때 비로소 내가 보인다.",
  },
  {
    author: "고요한 기록가",
    text: "풍경을 바라보다, 정직한 문장이 더 멀리 간다.",
  },
  {
    author: "오늘의 산책가",
    text: "천천히 적은 문장은 오래 남는다.",
  },
];

function formatExcerpt(value: string) {
  return value.replace(/\s+/g, " ").trim();
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
  const days: CalendarMonth["days"] = [];

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

function getRelativeDayLabel(entryDate: string, referenceIso: string) {
  const diff = getDayDifference(referenceIso, entryDate);

  if (diff === 1) {
    return "어제";
  }

  if (diff === 2) {
    return "그저께";
  }

  if (diff <= 7 && diff > 0) {
    return `${diff}일 전`;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(entryDate));
}

function mapMoodTrend(
  entries: EntryRow[],
  referenceIso: string,
): MoodTrendPoint[] {
  return entries.map((entry) => ({
    dayLabel: getRelativeDayLabel(entry.entry_date, referenceIso),
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
    entryDate: entry.entry_date,
    excerpt: formatExcerpt(entry.body),
    icon: entry.is_favorite ? "favorite" : "bookmark",
    paperClassName: getPaperTintClasses(entry.paper_tint_code).editorClassName,
    title: entry.title || "제목 없는 기록",
  }));
}

function getStreakValue(streakCount: number) {
  if (streakCount > 0) {
    return `${streakCount}일 연속 일기 쓰기 성공!`;
  }

  return "첫 기록을 작성해보세요.";
}

function formatDisplayNameWithHonorific(displayName: string) {
  const trimmedName = displayName.trim();

  if (!trimmedName) {
    return "기록자님";
  }

  return trimmedName.endsWith("님") ? trimmedName : `${trimmedName}님`;
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
  const calendarRangeStart = toIsoDate(
    addDays(startOfMonth(monthDates[0]), -6),
  );
  const calendarRangeEnd = toIsoDate(addDays(endOfMonth(monthDates[2]), 6));

  const [calendarResult, recentResult, moodResult] = await Promise.all([
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
      .limit(4),
    supabase
      .from("entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .limit(7),
  ]);

  const latestEntryDate = recentResult.data?.[0]?.entry_date ?? todayIso;
  const { data: streakResult } = await supabase.rpc("calculate_current_streak", {
    p_as_of: latestEntryDate,
    p_user_id: user.id,
  });

  const displayName =
    profile?.display_name ||
    user.user_metadata.full_name ||
    user.email?.split("@")[0] ||
    "기록자";
  const displayNameWithHonorific = formatDisplayNameWithHonorific(displayName);
  const latestWeather = recentResult.data?.[0]?.weather_label_snapshot ?? "맑음";
  const streakCount = Number(streakResult ?? 0);
  const quote = quotes[streakCount % quotes.length];
  const entryDates = new Set(
    (calendarResult.data ?? []).map((entry) => entry.entry_date),
  );
  const activeMonthIndex = monthDates.findIndex((monthDate) => {
    const monthKey = `${monthDate.getUTCFullYear()}-${String(
      monthDate.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    return monthKey === todayIso.slice(0, 7);
  });

  return {
    activeMonthIndex: activeMonthIndex >= 0 ? activeMonthIndex : 1,
    calendarMonths: monthDates.map((monthDate) =>
      buildCalendarMonth(monthDate, entryDates, todayIso),
    ),
    dateLabel: `${formatKoreanLongDate(todayIso, timezone)} • ${latestWeather}`,
    headline: `${getKoreanTimeGreeting(timezone)},\n${displayNameWithHonorific}.`,
    moodTrend: mapMoodTrend(moodResult.data ?? [], todayIso),
    quoteAuthor: quote.author,
    quoteText: quote.text,
    recentEntries: mapRecentEntries(recentResult.data ?? []),
    streak: {
      label: "WEEKLY STREAK",
      value: getStreakValue(streakCount),
    },
  };
});
