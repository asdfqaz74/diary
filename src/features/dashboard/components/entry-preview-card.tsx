import { Card } from "@/components/ui/card";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { DiaryEntryPreview } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

type EntryPreviewCardProps = {
  index: number;
  preview: DiaryEntryPreview;
};

export function EntryPreviewCard({ index, preview }: EntryPreviewCardProps) {
  return (
    <Card
      className={cn(
        "p-10 transition-shadow hover:shadow-[0_12px_48px_rgba(48,51,48,0.08)]",
        index % 2 === 0 ? "md:-rotate-[0.8deg]" : "md:mt-10 md:rotate-[0.8deg]",
      )}
      tone="paper"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-label text-sm uppercase tracking-[0.28em] text-outline">
          {preview.dateLabel}
        </span>
        <MaterialSymbol
          className="text-primary/40"
          name={preview.icon}
          opticalSize={24}
          weight={350}
        />
      </div>

      <h4 className="mt-7 font-headline text-[2rem] font-bold leading-tight text-on-surface">
        {preview.title}
      </h4>
      <p className="mt-6 text-xl leading-[1.8] text-on-surface-variant">
        {preview.excerpt}
      </p>
    </Card>
  );
}
