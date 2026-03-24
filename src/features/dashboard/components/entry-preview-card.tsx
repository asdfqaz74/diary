import Link from "next/link";
import type { DiaryEntryPreview } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type EntryPreviewCardProps = {
  index: number;
  preview: DiaryEntryPreview;
};

const tiltVariants = [
  "md:-rotate-[1.4deg]",
  "md:-rotate-[0.8deg]",
  "md:rotate-[0.7deg]",
  "md:rotate-[1.3deg]",
  "md:translate-y-2 md:-rotate-[1deg]",
  "md:translate-y-3 md:rotate-[1.1deg]",
];

function getTiltClass(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return tiltVariants[hash % tiltVariants.length] ?? tiltVariants[0];
}

export function EntryPreviewCard({ index, preview }: EntryPreviewCardProps) {
  return (
    <Link
      aria-label={`${preview.dateLabel} 일기 열기`}
      href={`/entries/${preview.entryDate}`}
      className={cn(
        "block self-start overflow-hidden rounded-[1.75rem] bg-surface-container-lowest p-10 ambient-shadow transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-[0_12px_48px_rgba(48,51,48,0.08)] md:max-h-128",
        preview.paperClassName,
        getTiltClass(`${preview.entryDate}-${preview.title}-${index}`),
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-label text-sm uppercase tracking-[0.28em] text-outline">
          {preview.dateLabel}
        </span>
      </div>
      <h4 className="mt-7 line-clamp-2 font-headline text-[2rem] font-bold leading-tight text-on-surface">
        {preview.title}
      </h4>
      <p className="mt-6 line-clamp-10 overflow-hidden pr-2 text-xl leading-[1.8] text-on-surface-variant">
        {preview.excerpt}
      </p>
    </Link>
  );
}
