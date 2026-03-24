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
  draftId: string;
  initialDraft: JournalDraft;
  meta: EditorMeta;
  moodOptions: MoodOption[];
  paperTintOptions: PaperTintOption[];
  subtitle: string;
  titlePlaceholder: string;
  weatherOptions: WeatherOption[];
  writingPlaceholder: string;
};

export type AutosaveDraftInput = JournalDraft & {
  draftId: string;
};

export type AutosaveDraftResult = {
  message?: string;
  ok: boolean;
  statusLabel: string;
};

export type PublishDraftInput = {
  draftId: string;
};

export type PublishDraftResult = {
  message?: string;
  ok: boolean;
  redirectTo?: string;
};

export type AutosaveDraftAction = (
  input: AutosaveDraftInput,
) => Promise<AutosaveDraftResult>;

export type PublishDraftAction = (
  input: PublishDraftInput,
) => Promise<PublishDraftResult>;
