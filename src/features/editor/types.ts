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
  entryDate: string;
  initialDraft: JournalDraft;
  meta: EditorMeta;
  moodOptions: MoodOption[];
  paperTintOptions: PaperTintOption[];
  subtitle: string;
  titlePlaceholder: string;
  weatherOptions: WeatherOption[];
  writingPlaceholder: string;
};

export type DraftSaveInput = JournalDraft & {
  draftId: string;
};

export type DraftSaveResult = {
  message?: string;
  ok: boolean;
  statusLabel: string;
};

export type SaveDraftInput = DraftSaveInput;

export type SaveDraftResult = {
  message?: string;
  ok: boolean;
  redirectTo?: string;
};

export type DraftSaveAction = (
  input: DraftSaveInput,
) => Promise<DraftSaveResult>;

export type SaveDraftAction = (
  input: SaveDraftInput,
) => Promise<SaveDraftResult>;

export type PublishDraftInput = SaveDraftInput;

export type PublishDraftResult = SaveDraftResult;

export type PublishDraftAction = SaveDraftAction;
