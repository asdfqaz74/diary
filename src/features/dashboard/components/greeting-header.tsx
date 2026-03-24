import type { StreakSummary } from "@/features/dashboard/types";
import { StreakBadge } from "@/features/dashboard/components/streak-badge";

type GreetingHeaderProps = {
  dateLabel: string;
  headline: string;
  streak: StreakSummary;
};

export function GreetingHeader({
  dateLabel,
  headline,
  streak,
}: GreetingHeaderProps) {
  const [headlineLead, headlineAccent] = headline.split("\n");

  return (
    <header className="mb-12 flex flex-col justify-between gap-8 xl:flex-row xl:items-start">
      <div className="max-w-3xl">
        <h2 className="font-headline text-4xl font-black leading-[1.05] tracking-tight text-on-surface md:text-7xl">
          {headlineLead}
          <br />
          <span className="italic text-primary">{headlineAccent}</span>
        </h2>
        <p className="mt-6 font-label text-xl text-on-surface-variant">
          {dateLabel}
        </p>
      </div>
      <StreakBadge streak={streak} />
    </header>
  );
}
