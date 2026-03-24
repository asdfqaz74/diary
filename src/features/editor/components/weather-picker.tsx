import { cn } from "@/lib/utils";
import type { WeatherOption } from "@/features/editor/types";
import { WeatherSymbol } from "@/features/editor/components/weather-symbol";

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
              "relative flex h-11 w-11 items-center justify-center rounded-full transition duration-150 ease-out",
              isActive
                ? "scale-105 bg-primary-container text-primary shadow-[0_10px_24px_rgba(79,100,91,0.16)] ring-2 ring-white/20"
                : "bg-white/8 text-white/65 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-white/14 hover:text-white",
            )}
          >
            <WeatherSymbol
              className={cn(
                "transition-transform duration-150",
                isActive ? "scale-105" : "",
              )}
              filled={isActive && option.icon === "cloud"}
              name={option.icon}
              opticalSize={28}
            />
            {isActive ? (
              <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-white" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
