export type StreakSummary = {
  label: string;
  value: string;
};

export type CalendarDay = {
  dayNumber: number;
  hasEntry?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isMuted?: boolean;
  key: string;
};

export type CalendarMonth = {
  days: CalendarDay[];
  label: string;
  monthKey: string;
  weekdayLabels: string[];
};

export type MoodTrendPoint = {
  dayLabel: string;
  icon: string;
  intensity: number;
  moodLabel: string;
};

export type DiaryEntryPreview = {
  dateLabel: string;
  excerpt: string;
  icon: string;
  entryDate: string;
  paperClassName: string;
  title: string;
};

export type DashboardData = {
  activeMonthIndex: number;
  calendarMonths: CalendarMonth[];
  dateLabel: string;
  headline: string;
  moodTrend: MoodTrendPoint[];
  quoteAuthor: string;
  quoteText: string;
  recentEntries: DiaryEntryPreview[];
  streak: StreakSummary;
};
