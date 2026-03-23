import { cache } from "react";

export type DiaryEntryPreview = {
  id: string;
  mood: string;
  snippet: string;
  title: string;
  updatedAt: string;
};

export type DiaryOverview = {
  captureRate: string;
  nextReviewWindow: string;
  recentEntries: DiaryEntryPreview[];
  reviewFocus: string;
  streakDays: number;
  weeklyWords: number;
};

const recentEntries: DiaryEntryPreview[] = [
  {
    id: "entry-021",
    title: "Rain before the subway ride",
    snippet: "A short note about slowing down just enough to notice the city.",
    mood: "Grounded",
    updatedAt: "06:40",
  },
  {
    id: "entry-020",
    title: "What still felt unresolved",
    snippet: "Capturing loose tension before it turns into background noise.",
    mood: "Honest",
    updatedAt: "Yesterday",
  },
  {
    id: "entry-019",
    title: "Three lines I want to keep",
    snippet: "A review pass that trimmed the noise without flattening the voice.",
    mood: "Clear",
    updatedAt: "Sun",
  },
];

export const getDiaryOverview = cache(async (): Promise<DiaryOverview> => {
  await new Promise((resolve) => setTimeout(resolve, 120));

  return {
    streakDays: 18,
    weeklyWords: 2840,
    captureRate: "5 of 7 planned check-ins",
    nextReviewWindow: "Tonight at 21:00",
    reviewFocus: "Review notes with the strongest emotional signal first.",
    recentEntries,
  };
});
