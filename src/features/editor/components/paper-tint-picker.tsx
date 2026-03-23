import { cn } from "@/lib/utils";
import type { PaperTintOption } from "@/features/editor/types";

type PaperTintPickerProps = {
  onSelect: (tintId: string) => void;
  options: PaperTintOption[];
  selectedId: string;
};

export function PaperTintPicker({
  onSelect,
  options,
  selectedId,
}: PaperTintPickerProps) {
  return (
    <div className="flex gap-3 md:mt-auto md:flex-col">
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
              "h-5 w-5 rounded-full transition",
              option.swatchClassName,
              isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "",
            )}
          />
        );
      })}
    </div>
  );
}
