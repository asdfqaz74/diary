import { cn } from "@/lib/utils";

type MaterialSymbolProps = {
  className?: string;
  filled?: boolean;
  name: string;
  opticalSize?: number;
  weight?: number;
};

export function MaterialSymbol({
  className,
  filled = false,
  name,
  opticalSize = 24,
  weight = 300,
}: MaterialSymbolProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("material-symbols-outlined", className)}
      style={
        {
          "--symbol-fill": filled ? 1 : 0,
          "--symbol-weight": weight,
          fontSize: `${opticalSize}px`,
        } as React.CSSProperties
      }
    >
      {name}
    </span>
  );
}
