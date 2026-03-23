import { MaterialSymbol } from "@/components/ui/material-symbol";

type EditorMetaFooterProps = {
  locationLabel: string;
  statusLabel: string;
  timeLabel: string;
};

export function EditorMetaFooter({
  locationLabel,
  statusLabel,
  timeLabel,
}: EditorMetaFooterProps) {
  return (
    <footer className="mt-12 flex flex-col gap-4 border-t border-[rgba(176,179,174,0.08)] pt-8 font-label text-sm text-outline md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <span className="flex items-center gap-1.5">
          <MaterialSymbol name="schedule" opticalSize={18} />
          {timeLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <MaterialSymbol name="location_on" opticalSize={18} />
          {locationLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        <span>{statusLabel}</span>
      </div>
    </footer>
  );
}
