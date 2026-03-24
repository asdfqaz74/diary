"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { JournalPaper } from "@/features/editor/components/journal-paper";
import { MoodPicker } from "@/features/editor/components/mood-picker";
import { PaperTintPicker } from "@/features/editor/components/paper-tint-picker";
import { WeatherPicker } from "@/features/editor/components/weather-picker";
import type {
  AutosaveDraftAction,
  EditorData,
  JournalDraft,
  PublishDraftAction,
} from "@/features/editor/types";

type EditorWorkspaceProps = EditorData & {
  autosaveDraft: AutosaveDraftAction;
  publishDraft: PublishDraftAction;
};

export function EditorWorkspace({
  autosaveDraft,
  dateLabel,
  draftId,
  initialDraft,
  meta,
  moodOptions,
  paperTintOptions,
  publishDraft,
  subtitle,
  titlePlaceholder,
  weatherOptions,
  writingPlaceholder,
}: EditorWorkspaceProps) {
  const router = useRouter();
  const [draft, setDraft] = useState(initialDraft);
  const [statusLabel, setStatusLabel] = useState(meta.initialStatusLabel);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAutosaving, startAutosaveTransition] = useTransition();
  const [isPublishing, startPublishTransition] = useTransition();
  const hasMountedRef = useRef(false);

  const activeTint =
    paperTintOptions.find((option) => option.id === draft.tintId) ??
    paperTintOptions[0];

  const runAutosave = useEffectEvent(async (nextDraft: JournalDraft) => {
    const result = await autosaveDraft({
      draftId,
      ...nextDraft,
    });

    if (!result.ok) {
      setErrorMessage(result.message ?? "자동 저장에 실패했습니다.");
      setStatusLabel(result.statusLabel);
      return;
    }

    setErrorMessage(null);
    setStatusLabel(result.statusLabel);
  });

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timer = window.setTimeout(() => {
      startAutosaveTransition(() => {
        void runAutosave(draft);
      });
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [draft]);

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

  function handlePublish() {
    setErrorMessage(null);

    startPublishTransition(() => {
      void (async () => {
        const result = await publishDraft({ draftId });

        if (!result.ok) {
          setStatusLabel("저장 실패");
          setErrorMessage(result.message ?? "기록 저장에 실패했습니다.");
          return;
        }

        setStatusLabel("기록 저장됨");
        router.push(result.redirectTo ?? "/");
        router.refresh();
      })();
    });
  }

  const liveStatusLabel = isPublishing
    ? "기록 저장 중..."
    : isAutosaving
      ? "자동 저장 중..."
      : statusLabel;

  return (
    <>
      <EditorHeader
        dateLabel={dateLabel}
        isSaving={isPublishing}
        onSave={handlePublish}
        subtitle={subtitle}
      />

      {errorMessage ? (
        <p className="mb-4 font-label text-sm text-red-700">{errorMessage}</p>
      ) : null}

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
            statusLabel={liveStatusLabel}
            titlePlaceholder={titlePlaceholder}
            writingPlaceholder={writingPlaceholder}
          />
        </div>
      </Card>
    </>
  );
}
