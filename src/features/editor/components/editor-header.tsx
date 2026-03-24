import Link from "next/link";
import { LogoutButton } from "@/components/ui/logout-button";
import { MaterialSymbol } from "@/components/ui/material-symbol";

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
  const isBusy = isSavingDraftChanges || isSavingEntry;

  return (
    <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="font-label text-sm uppercase tracking-[0.26em] text-on-surface-variant md:text-base">
          {subtitle}
        </p>
        <h1 className="font-headline text-5xl font-black tracking-tight text-primary md:text-7xl">
          {dateLabel}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
        <LogoutButton className="md:hidden" iconOnly />
        <Link
          aria-label="상세로 돌아가기"
          href={detailHref}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-primary"
        >
          <MaterialSymbol name="arrow_back" opticalSize={24} weight={350} />
        </Link>
        {/* <IconButton icon="share" label="공유하기" />
        <IconButton icon="more_vert" label="더보기" /> */}
        <button
          type="button"
          onClick={onSaveDraftChanges}
          disabled={isBusy}
          className="rounded-full border border-[rgba(92,111,97,0.18)] px-5 py-3 font-label text-base font-semibold text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSavingDraftChanges ? "임시저장 중..." : "임시저장"}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isBusy}
          className="rounded-full bg-primary px-6 py-3 font-label text-lg font-semibold text-on-primary transition hover:bg-primary-dim disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSavingEntry ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </header>
  );
}
