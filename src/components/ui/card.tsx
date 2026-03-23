import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardTone = "ink" | "muted" | "paper";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
};

const toneClasses: Record<CardTone, string> = {
  paper: "bg-surface-container-lowest ambient-shadow",
  muted: "bg-surface-container-low",
  ink: "bg-primary text-on-primary deep-shadow",
};

export function Card({
  children,
  className,
  tone = "paper",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-[1.75rem]", toneClasses[tone], className)}
      {...props}
    >
      {children}
    </div>
  );
}
