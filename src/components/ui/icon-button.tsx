import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  filled?: boolean;
  icon: string;
  iconClassName?: string;
  label: string;
};

export function IconButton({
  className,
  filled = false,
  icon,
  iconClassName,
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      type={type}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-primary disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <MaterialSymbol
        className={iconClassName}
        filled={filled}
        name={icon}
        opticalSize={24}
        weight={350}
      />
    </button>
  );
}
