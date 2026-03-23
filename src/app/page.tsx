import { LivePromptCard } from "@/features/home/components/live-prompt-card";
import { WorkspaceModePanel } from "@/features/home/components/workspace-mode-panel";
import { getDiaryOverview } from "@/lib/server/get-diary-overview";

export default async function Home() {
  const overview = await getDiaryOverview();
  const headlineMetrics = [
    {
      label: "Current streak",
      value: `${overview.streakDays} days`,
      tone: "Warm momentum",
    },
    {
      label: "Words this week",
      value: overview.weeklyWords.toLocaleString(),
      tone: "Server snapshot",
    },
    {
      label: "Check-ins landed",
      value: overview.captureRate,
      tone: "Client state stays separate",
    },
  ];

  return (
    <main className="px-5 py-8 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[2rem] border border-border/80 bg-surface/95 p-7 shadow-[0_20px_80px_rgba(77,43,20,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 font-medium text-accent-strong">
                  App Router + src starter
                </span>
                <span className="text-muted-foreground">
                  RSC-first by default, interactive fetching only where it earns
                  the cost.
                </span>
              </div>

              <div className="max-w-3xl space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                  Diary workspace
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground md:text-6xl">
                  A practical starter for writing flows that keeps the server as
                  the default source of truth.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  The landing page is an async server component, TanStack Query
                  is reserved for interactive prompt refreshes, and Jotai holds
                  lightweight workspace state without pretending to be your data
                  layer.
                </p>
              </div>

              <dl className="grid gap-4 md:grid-cols-3">
                {headlineMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.5rem] border border-border bg-white/75 p-4"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {metric.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold text-foreground">
                      {metric.value}
                    </dd>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {metric.tone}
                    </p>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <section className="rounded-[2rem] border border-border/80 bg-foreground p-6 text-background shadow-[0_20px_80px_rgba(22,16,10,0.18)]">
            <div className="flex h-full flex-col gap-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-background/70">
                  Server snapshot
                </p>
                <h2 className="text-2xl font-semibold">
                  Recent entries fetched in the page server component
                </h2>
                <p className="text-sm leading-6 text-background/70">
                  This section is rendered from an async server helper, not
                  hydrated client cache.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-background/70">Next review</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {overview.nextReviewWindow}
                    </p>
                  </div>
                  <p className="max-w-32 text-right text-sm text-background/70">
                    {overview.reviewFocus}
                  </p>
                </div>
              </div>

              <ul className="grid gap-3">
                {overview.recentEntries.map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{entry.title}</p>
                        <p className="text-sm leading-6 text-background/72">
                          {entry.snippet}
                        </p>
                      </div>
                      <div className="text-right text-xs uppercase tracking-[0.18em] text-background/65">
                        <p>{entry.mood}</p>
                        <p className="mt-2">{entry.updatedAt}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <LivePromptCard />
          <WorkspaceModePanel />
        </section>
      </div>
    </main>
  );
}
