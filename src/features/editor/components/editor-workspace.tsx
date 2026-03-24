"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EditorActionButtons } from "@/features/editor/components/editor-action-buttons";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { JournalPaper } from "@/features/editor/components/journal-paper";
import { MoodPicker } from "@/features/editor/components/mood-picker";
import { PaperTintPicker } from "@/features/editor/components/paper-tint-picker";
import { WeatherPicker } from "@/features/editor/components/weather-picker";
import type {
  DraftSaveAction,
  EditorData,
  JournalDraft,
  SaveDraftAction,
} from "@/features/editor/types";

type EditorWorkspaceProps = EditorData & {
  saveDraft: SaveDraftAction;
  saveDraftChanges: DraftSaveAction;
};

export function EditorWorkspace({
  dateLabel,
  draftId,
  entryDate,
  initialDraft,
  meta,
  moodOptions,
  paperTintOptions,
  saveDraft,
  saveDraftChanges,
  subtitle,
  titlePlaceholder,
  weatherOptions,
  writingPlaceholder,
}: EditorWorkspaceProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);
  const [statusLabel, setStatusLabel] = useState(meta.initialStatusLabel);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSavingDraftChanges, startSaveDraftChangesTransition] =
    useTransition();
  const [isSavingEntry, startSaveEntryTransition] = useTransition();

  const activeTint =
    paperTintOptions.find((option) => option.id === draft.tintId) ??
    paperTintOptions[0];

  function updateDraft<Key extends keyof JournalDraft>(
    key: Key,
    value: JournalDraft[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
    setStatusLabel("변경 사항 있음");
    setErrorMessage(null);
  }

  function handleSaveDraftChanges() {
    setErrorMessage(null);

    startSaveDraftChangesTransition(() => {
      void (async () => {
        const result = await saveDraftChanges({
          draftId,
          ...draft,
        });

        if (!result.ok) {
          setStatusLabel(result.statusLabel);
          setErrorMessage(result.message ?? "임시저장에 실패했습니다.");
          return;
        }

        setStatusLabel(result.statusLabel);
      })();
    });
  }

  function handleSave() {
    setErrorMessage(null);

    startSaveEntryTransition(() => {
      void (async () => {
        const result = await saveDraft({
          draftId,
          ...draft,
        });

        if (!result.ok) {
          setStatusLabel("저장 실패");
          setErrorMessage(result.message ?? "기록 저장에 실패했습니다.");
          return;
        }

        setStatusLabel("저장됨");
        router.push(result.redirectTo ?? `/entries/${entryDate}`);
        router.refresh();
      })();
    });
  }

  const liveStatusLabel = isSavingEntry
    ? "저장 중..."
    : isSavingDraftChanges
      ? "임시저장 중..."
      : statusLabel;

  return (
    <>
      <EditorHeader
        dateLabel={dateLabel}
        detailHref={`/entries/${entryDate}`}
        isSavingDraftChanges={isSavingDraftChanges}
        isSavingEntry={isSavingEntry}
        onSave={handleSave}
        onSaveDraftChanges={handleSaveDraftChanges}
        subtitle={subtitle}
      />

      {errorMessage ? (
        <p className="mb-4 font-label text-sm text-red-700">{errorMessage}</p>
      ) : null}

      <Card className="overflow-hidden" tone="paper">
        <div className="border-b border-white/8 bg-primary/92 px-5 py-6 md:hidden">
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <MoodPicker
                onSelect={(moodId) => {
                  updateDraft("moodId", moodId);
                }}
                options={moodOptions}
                selectedId={draft.moodId}
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <WeatherPicker
                onSelect={(weatherId) => {
                  updateDraft("weatherId", weatherId);
                }}
                options={weatherOptions}
                selectedId={draft.weatherId}
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <PaperTintPicker
                onSelect={(tintId) => {
                  updateDraft("tintId", tintId);
                }}
                options={paperTintOptions}
                selectedId={draft.tintId}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <aside className="hidden w-24 shrink-0 flex-col items-center justify-between bg-primary/92 py-10 md:flex">
            <div className="flex flex-col items-center gap-8">
              <MoodPicker
                onSelect={(moodId) => {
                  updateDraft("moodId", moodId);
                }}
                options={moodOptions}
                selectedId={draft.moodId}
              />

              <WeatherPicker
                onSelect={(weatherId) => {
                  updateDraft("weatherId", weatherId);
                }}
                options={weatherOptions}
                selectedId={draft.weatherId}
              />
            </div>

            <PaperTintPicker
              onSelect={(tintId) => {
                updateDraft("tintId", tintId);
              }}
              options={paperTintOptions}
              selectedId={draft.tintId}
            />
          </aside>

          <JournalPaper
            draft={draft}
            meta={meta}
            onBodyChange={(value) => {
              updateDraft("body", value);
            }}
            onTitleChange={(value) => {
              updateDraft("title", value);
            }}
            paperClassName={activeTint.editorClassName}
            statusLabel={liveStatusLabel}
            titlePlaceholder={titlePlaceholder}
            writingPlaceholder={writingPlaceholder}
          />
        </div>
      </Card>

      <div className="mt-4 md:hidden">
        <EditorActionButtons
          className="w-full"
          isSavingDraftChanges={isSavingDraftChanges}
          isSavingEntry={isSavingEntry}
          onSave={handleSave}
          onSaveDraftChanges={handleSaveDraftChanges}
          stretch
        />
      </div>
    </>
  );
}
