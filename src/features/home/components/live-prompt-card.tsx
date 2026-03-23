"use client";

import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type ReflectionPrompt = {
  generatedAt: string;
  lens: string;
  prompt: string;
};

async function fetchReflectionPrompt(): Promise<ReflectionPrompt> {
  const response = await fetch("/api/reflection-prompt", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load a reflection prompt.");
  }

  return response.json();
}

export function LivePromptCard() {
  const { data, error, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["reflection-prompt"],
    queryFn: fetchReflectionPrompt,
  });

  const refreshedAt = data
    ? new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(data.generatedAt))
    : null;

  return (
    <section className="rounded-[2rem] border border-border/80 bg-surface/95 p-6 shadow-[0_20px_80px_rgba(77,43,20,0.12)]">
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              TanStack Query
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Fresh prompt
            </h2>
            <p className="max-w-lg text-sm leading-6 text-muted-foreground">
              This client component fetches on demand and keeps the response in
              query cache instead of pushing routine reads into global state.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            disabled={isFetching}
            className={cn(
              "rounded-full border border-accent/20 bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent-strong/70",
              isFetching && "shadow-[0_0_0_4px_rgba(199,104,51,0.14)]",
            )}
          >
            {isFetching ? "Refreshing..." : "Refresh prompt"}
          </button>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-white/80 p-5">
          {isLoading ? (
            <p className="text-sm leading-7 text-muted-foreground">
              Loading the first prompt for this session...
            </p>
          ) : null}

          {error instanceof Error ? (
            <p className="text-sm leading-7 text-red-700">{error.message}</p>
          ) : null}

          {data ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-border bg-surface px-3 py-1 text-muted-foreground">
                  Lens: {data.lens}
                </span>
                {refreshedAt ? (
                  <span className="text-muted-foreground">
                    Last refreshed at {refreshedAt}
                  </span>
                ) : null}
              </div>
              <p className="max-w-2xl text-2xl font-medium leading-9 text-foreground text-balance">
                {data.prompt}
              </p>
            </div>
          ) : null}
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          Use this pattern for client-only refresh, cache invalidation, and
          mutation follow-up. Default reads should stay on the server.
        </p>
      </div>
    </section>
  );
}
