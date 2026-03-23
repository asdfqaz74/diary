import { cn } from "@/lib/utils";
import { EditorMetaFooter } from "@/features/editor/components/editor-meta-footer";
import type { EditorMeta, JournalDraft } from "@/features/editor/types";

type JournalPaperProps = {
  draft: JournalDraft;
  meta: EditorMeta;
  onBodyChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  paperClassName: string;
  statusLabel: string;
  titlePlaceholder: string;
  writingPlaceholder: string;
};

export function JournalPaper({
  draft,
  meta,
  onBodyChange,
  onTitleChange,
  paperClassName,
  statusLabel,
  titlePlaceholder,
  writingPlaceholder,
}: JournalPaperProps) {
  return (
    <div
      className={cn(
        "paper-texture flex min-h-[44rem] flex-1 flex-col rounded-[1.75rem] p-8 md:p-12",
        paperClassName,
      )}
    >
      <input
        aria-label="제목"
        value={draft.title}
        onChange={(event) => {
          onTitleChange(event.target.value);
        }}
        placeholder={titlePlaceholder}
        className="w-full border-none bg-transparent p-0 font-headline text-4xl font-bold text-on-surface outline-none placeholder:text-outline-variant/45"
      />

      <textarea
        aria-label="본문"
        value={draft.body}
        onChange={(event) => {
          onBodyChange(event.target.value);
        }}
        placeholder={writingPlaceholder}
        className="writing-lines mt-8 min-h-[30rem] flex-1 border-none bg-transparent p-0 text-xl leading-[1.8] text-on-surface-variant outline-none placeholder:italic placeholder:text-outline-variant/45"
      />

      <EditorMetaFooter
        locationLabel={meta.locationLabel}
        statusLabel={statusLabel}
        timeLabel={meta.timeLabel}
      />
    </div>
  );
}
