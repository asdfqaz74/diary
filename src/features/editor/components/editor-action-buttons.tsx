import { cn } from "@/lib/utils";

type EditorActionButtonsProps = {
  className?: string;
  compact?: boolean;
  isSavingDraftChanges: boolean;
  isSavingEntry: boolean;
  onSave: () => void;
  onSaveDraftChanges: () => void;
  stretch?: boolean;
};

export function EditorActionButtons({
  className,
  compact = false,
  isSavingDraftChanges,
  isSavingEntry,
  onSave,
  onSaveDraftChanges,
  stretch = false,
}: EditorActionButtonsProps) {
  const isBusy = isSavingDraftChanges || isSavingEntry;

  return (
    <div
      className={cn(
        stretch ? "grid grid-cols-2 gap-3" : "flex items-center gap-2",
        className,
      )}
    >
      <button
        type="button"
        onClick={onSaveDraftChanges}
        disabled={isBusy}
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-[rgba(92,111,97,0.18)] font-label font-semibold text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60",
          compact ? "px-4 py-2.5 text-sm" : "px-5 py-3 text-base",
          stretch ? "w-full" : "",
        )}
      >
        {isSavingDraftChanges ? "임시저장 중..." : "임시저장"}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={isBusy}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-primary font-label font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-70",
          compact ? "px-4 py-2.5 text-sm" : "px-6 py-3 text-lg",
          stretch ? "w-full" : "",
        )}
      >
        {isSavingEntry ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
