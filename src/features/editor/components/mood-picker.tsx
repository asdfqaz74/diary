import { cn } from "@/lib/utils";
import type { MoodOption } from "@/features/editor/types";

type MoodPickerProps = {
  onSelect: (moodId: string) => void;
  options: MoodOption[];
  selectedId: string;
};

export function MoodPicker({
  onSelect,
  options,
  selectedId,
}: MoodPickerProps) {
  return (
    <div className="flex gap-4 md:flex-col">
      {options.map((option) => {
        const isActive = option.id === selectedId;

        return (
          <button
            key={option.id}
            type="button"
            aria-label={option.label}
            aria-pressed={isActive}
            onClick={() => {
              onSelect(option.id);
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-2xl transition hover:scale-105",
              isActive
                ? "bg-primary-container grayscale-0"
                : "grayscale hover:bg-surface-container-highest",
            )}
          >
            <span aria-hidden="true">{option.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}
