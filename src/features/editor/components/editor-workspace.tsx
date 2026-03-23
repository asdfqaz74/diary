"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { JournalPaper } from "@/features/editor/components/journal-paper";
import { MoodPicker } from "@/features/editor/components/mood-picker";
import { PaperTintPicker } from "@/features/editor/components/paper-tint-picker";
import { WeatherPicker } from "@/features/editor/components/weather-picker";
import type { EditorData, JournalDraft } from "@/features/editor/types";

type EditorWorkspaceProps = EditorData;

export function EditorWorkspace({
  dateLabel,
  initialDraft,
  meta,
  moodOptions,
  paperTintOptions,
  subtitle,
  titlePlaceholder,
  weatherOptions,
  writingPlaceholder,
}: EditorWorkspaceProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [statusLabel, setStatusLabel] = useState(meta.initialStatusLabel);
  const [isSaving, startTransition] = useTransition();

  function updateDraft<Key extends keyof JournalDraft>(
    key: Key,
    value: JournalDraft[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
    setStatusLabel("변경 사항 있음");
  }

  function handleSave() {
    startTransition(() => {
      setStatusLabel("방금 저장됨");
    });
  }

  const activeTint =
    paperTintOptions.find((option) => option.id === draft.tintId) ??
    paperTintOptions[0];

  return (
    <>
      <EditorHeader
        dateLabel={dateLabel}
        isSaving={isSaving}
        onSave={handleSave}
        subtitle={subtitle}
      />

      <Card className="overflow-hidden" tone="paper">
        <div className="flex flex-col md:flex-row">
          <aside className="flex w-full items-start justify-between gap-8 bg-surface-container-low px-6 py-8 md:w-24 md:flex-col md:justify-start md:px-0 md:py-10">
            <div className="mx-auto flex flex-col gap-8">
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

            <div className="mx-auto">
              <PaperTintPicker
                onSelect={(tintId) => {
                  updateDraft("tintId", tintId);
                }}
                options={paperTintOptions}
                selectedId={draft.tintId}
              />
            </div>
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
            statusLabel={statusLabel}
            titlePlaceholder={titlePlaceholder}
            writingPlaceholder={writingPlaceholder}
          />
        </div>
      </Card>
    </>
  );
}
