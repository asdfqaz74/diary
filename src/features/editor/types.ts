export type MoodOption = {
  emoji: string;
  id: string;
  label: string;
};

export type WeatherOption = {
  icon: string;
  id: string;
  label: string;
};

export type PaperTintOption = {
  editorClassName: string;
  id: string;
  label: string;
  swatchClassName: string;
};

export type JournalDraft = {
  body: string;
  moodId: string;
  tintId: string;
  title: string;
  weatherId: string;
};

export type EditorMeta = {
  initialStatusLabel: string;
  locationLabel: string;
  timeLabel: string;
};

export type EditorData = {
  dateLabel: string;
  initialDraft: JournalDraft;
  meta: EditorMeta;
  moodOptions: MoodOption[];
  paperTintOptions: PaperTintOption[];
  subtitle: string;
  titlePlaceholder: string;
  weatherOptions: WeatherOption[];
  writingPlaceholder: string;
};
