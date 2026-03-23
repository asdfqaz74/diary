import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type FloatingActionButtonProps = {
  className?: string;
  href: string;
  icon: string;
  label: string;
};

export function FloatingActionButton({
  className,
  href,
  icon,
  label,
}: FloatingActionButtonProps) {
  return (
    <Link
      aria-label={label}
      href={href}
      className={cn(
        "deep-shadow fixed bottom-24 right-6 z-40 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-primary text-on-primary transition hover:scale-[1.03] md:bottom-14 md:right-16 md:h-24 md:w-24",
        className,
      )}
    >
      <MaterialSymbol
        className="mb-1 text-white"
        filled
        name={icon}
        opticalSize={30}
        weight={500}
      />
      <span className="font-label text-[10px] font-semibold tracking-tight md:text-[11px] text-white">
        {label}
      </span>
    </Link>
  );
}
