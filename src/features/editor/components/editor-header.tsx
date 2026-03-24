import Link from "next/link";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { EditorActionButtons } from "@/features/editor/components/editor-action-buttons";

type EditorHeaderProps = {
  dateLabel: string;
  detailHref: string;
  isSavingDraftChanges: boolean;
  isSavingEntry: boolean;
  onSave: () => void;
  onSaveDraftChanges: () => void;
  subtitle: string;
};

export function EditorHeader({
  dateLabel,
  detailHref,
  isSavingDraftChanges,
  isSavingEntry,
  onSave,
  onSaveDraftChanges,
  subtitle,
}: EditorHeaderProps) {
  return (
    <header className="mb-8 md:mb-12">
      <div className="space-y-6 md:flex md:items-end md:justify-between md:gap-6 md:space-y-0">
        <div className="space-y-2">
          <p className="font-label text-sm uppercase tracking-[0.26em] text-on-surface-variant md:text-base">
            {subtitle}
          </p>
          <h1 className="font-headline text-4xl font-black leading-[1.02] tracking-tight text-primary md:text-7xl">
            {dateLabel}
          </h1>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            aria-label="상세로 돌아가기"
            href={detailHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-primary"
          >
            <MaterialSymbol name="arrow_back" opticalSize={24} weight={350} />
          </Link>
          <EditorActionButtons
            isSavingDraftChanges={isSavingDraftChanges}
            isSavingEntry={isSavingEntry}
            onSave={onSave}
            onSaveDraftChanges={onSaveDraftChanges}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 md:hidden">
        <Link
          aria-label="상세로 돌아가기"
          href={detailHref}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(92,111,97,0.18)] text-primary transition hover:bg-surface-container-low"
        >
          <MaterialSymbol name="arrow_back" opticalSize={24} weight={350} />
        </Link>
        <EditorActionButtons
          className="ml-auto"
          compact
          isSavingDraftChanges={isSavingDraftChanges}
          isSavingEntry={isSavingEntry}
          onSave={onSave}
          onSaveDraftChanges={onSaveDraftChanges}
        />
      </div>
    </header>
  );
}
