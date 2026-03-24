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
    <div className="flex flex-wrap justify-center gap-3 md:mt-auto md:flex-col md:justify-start">
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
              "h-6 w-6 rounded-full transition duration-150 ease-out hover:scale-105",
              option.swatchClassName,
              isActive
                ? "scale-110 shadow-[0_0_0_2px_rgba(255,255,255,0.92),0_10px_22px_rgba(0,0,0,0.16)]"
                : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]",
            )}
          />
        );
      })}
    </div>
  );
}
