import "server-only";

type DateParts = {
  day: string;
  hour: string;
  month: string;
  weekday: string;
  year: string;
};

function getDateTimeParts(date: Date, timeZone: string): DateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    month: "2-digit",
    timeZone,
    weekday: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);

  function part(type: Intl.DateTimeFormatPartTypes) {
    return parts.find((value) => value.type === type)?.value ?? "";
  }

  return {
    day: part("day"),
    hour: part("hour"),
    month: part("month"),
    weekday: part("weekday"),
    year: part("year"),
  };
}

export function getTodayIsoDate(timeZone: string) {
  const parts = getDateTimeParts(new Date(), timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getCurrentKoreanTime(timeZone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date());
}

export function parseIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toIsoDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function addMonths(date: Date, months: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
}

export function startOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function endOfMonth(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

export function formatKoreanLongDate(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    timeZone,
    weekday: "long",
    year: "numeric",
  }).format(parseIsoDate(isoDate));
}

export function formatKoreanEditorDate(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    day: "numeric",
    month: "long",
    timeZone,
    year: "numeric",
  }).format(parseIsoDate(isoDate));
}

export function formatEnglishDateLabel(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  })
    .format(parseIsoDate(isoDate))
    .toUpperCase();
}

export function formatMonthTitle(date: Date) {
  return `${date.getUTCMonth() + 1}월의 기록`;
}

export function formatEnglishWeekdayPeriod(timeZone: string) {
  const parts = getDateTimeParts(new Date(), timeZone);
  const hour = Number(parts.hour);
  const period =
    hour < 12 ? "MORNING" : hour < 18 ? "AFTERNOON" : "EVENING";

  return `${parts.weekday.toUpperCase()} ${period}`;
}

export function getKoreanTimeGreeting(timeZone: string) {
  const hour = Number(getDateTimeParts(new Date(), timeZone).hour);

  if (hour < 12) {
    return "차분한 아침입니다";
  }

  if (hour < 18) {
    return "평온한 오후입니다";
  }

  return "고요한 저녁입니다";
}

export function getDayDifference(fromIso: string, toIso: string) {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  return Math.round(
    (from.getTime() - to.getTime()) / (24 * 60 * 60 * 1000),
  );
}
