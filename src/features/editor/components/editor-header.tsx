import { IconButton } from "@/components/ui/icon-button";

type EditorHeaderProps = {
  dateLabel: string;
  isSaving: boolean;
  onSave: () => void;
  subtitle: string;
};

export function EditorHeader({
  dateLabel,
  isSaving,
  onSave,
  subtitle,
}: EditorHeaderProps) {
  return (
    <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="font-headline text-5xl font-black tracking-tight text-primary md:text-7xl">
          {dateLabel}
        </h1>
        <p className="font-label text-sm uppercase tracking-[0.26em] text-on-surface-variant md:text-base">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start md:self-auto">
        <IconButton icon="share" label="공유하기" />
        <IconButton icon="more_vert" label="더보기" />
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-primary px-6 py-3 font-label text-lg font-semibold text-on-primary transition hover:bg-primary-dim"
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </header>
  );
}
