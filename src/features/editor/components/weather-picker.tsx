import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { WeatherOption } from "@/features/editor/types";

type WeatherPickerProps = {
  onSelect: (weatherId: string) => void;
  options: WeatherOption[];
  selectedId: string;
};

export function WeatherPicker({
  onSelect,
  options,
  selectedId,
}: WeatherPickerProps) {
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
              "rounded-full p-1 text-outline transition hover:text-primary",
              isActive ? "text-primary" : "",
            )}
          >
            <MaterialSymbol
              filled={isActive && option.icon === "cloud"}
              name={option.icon}
              opticalSize={28}
              weight={350}
            />
          </button>
        );
      })}
    </div>
  );
}
