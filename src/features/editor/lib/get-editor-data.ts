import { cache } from "react";
import type { EditorData } from "@/features/editor/types";

const editorData: EditorData = {
  dateLabel: "2026년 5월 20일",
  subtitle: "WEDNESDAY AFTERNOON",
  titlePlaceholder: "오늘의 제목...",
  writingPlaceholder: "이곳에 당신의 진심을 담아보세요...",
  meta: {
    timeLabel: "오후 2:45",
    locationLabel: "서울, 대한민국",
    initialStatusLabel: "자동 저장됨",
  },
  initialDraft: {
    title: "",
    body: "",
    moodId: "meditative",
    weatherId: "cloud",
    tintId: "plain",
  },
  moodOptions: [
    { id: "meditative", label: "명상하는 기분", emoji: "🧘" },
    { id: "calm", label: "평온한 기분", emoji: "🙂" },
    { id: "foggy", label: "복잡한 기분", emoji: "😶‍🌫️" },
    { id: "quiet", label: "가라앉은 기분", emoji: "😔" },
  ],
  weatherOptions: [
    { id: "sunny", label: "맑은 날씨", icon: "wb_sunny" },
    { id: "cloud", label: "흐린 날씨", icon: "cloud" },
    { id: "rainy", label: "비 오는 날씨", icon: "rainy" },
    { id: "snow", label: "눈 오는 날씨", icon: "ac_unit" },
  ],
  paperTintOptions: [
    {
      id: "plain",
      label: "백색 용지",
      swatchClassName: "bg-surface-container-lowest",
      editorClassName: "bg-white/88",
    },
    {
      id: "stone",
      label: "담백한 회백 용지",
      swatchClassName: "bg-stone-100",
      editorClassName: "bg-stone-50/90",
    },
    {
      id: "rose",
      label: "잔잔한 장밋빛 용지",
      swatchClassName: "bg-rose-50",
      editorClassName: "bg-rose-50/90",
    },
    {
      id: "sky",
      label: "옅은 하늘빛 용지",
      swatchClassName: "bg-sky-50",
      editorClassName: "bg-sky-50/88",
    },
  ],
};

export const getEditorData = cache(async (): Promise<EditorData> => {
  return editorData;
});
