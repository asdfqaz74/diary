import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PillBadgeProps = HTMLAttributes<HTMLDivElement>;

export function PillBadge({
  children,
  className,
  ...props
}: PillBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-4 rounded-full bg-secondary-container px-5 py-4 text-primary ambient-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
