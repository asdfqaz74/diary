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
    <div className="flex flex-wrap justify-center gap-4 md:flex-col md:justify-start">
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
              "flex h-11 w-11 items-center justify-center rounded-full text-2xl transition duration-150 ease-out",
              isActive
                ? "scale-105 bg-primary-container shadow-[0_10px_24px_rgba(79,100,91,0.18)] ring-2 ring-white/20"
                : "bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:scale-105 hover:bg-white/16",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "drop-shadow-[0_1px_1px_rgba(0,0,0,0.16)] transition duration-150",
                isActive ? "scale-105 saturate-125" : "saturate-110",
              )}
            >
              {option.emoji}
            </span>
          </button>
        );
      })}
    </div>
  );
}
