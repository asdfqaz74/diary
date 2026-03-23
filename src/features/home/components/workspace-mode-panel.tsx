"use client";

import { useAtom } from "jotai";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { workspaceModeAtom, type WorkspaceMode } from "@/store/ui";

type WorkspacePreset = {
  description: string;
  focusPoints: string[];
  label: string;
  title: string;
  value: WorkspaceMode;
};

const workspacePresets: WorkspacePreset[] = [
  {
    value: "capture",
    label: "Capture",
    title: "Capture with less friction",
    description:
      "Use Jotai for shared client state that changes the writing surface, not for duplicating remote diary data.",
    focusPoints: [
      "Keep the first pass short and rough.",
      "Tag the emotional signal before it fades.",
      "Leave cleanup for a later mode.",
    ],
  },
  {
    value: "shape",
    label: "Shape",
    title: "Shape raw notes into entries",
    description:
      "This view turns scattered notes into a coherent draft by highlighting structure instead of collection.",
    focusPoints: [
      "Group fragments that belong to the same scene.",
      "Promote one line into the working headline.",
      "Trim repeated context before expanding details.",
    ],
  },
  {
    value: "review",
    label: "Review",
    title: "Tighten what deserves to last",
    description:
      "Review mode is for the final pass: what should stay, what should move, and what should disappear.",
    focusPoints: [
      "Protect the lines that carry momentum.",
      "Cut filler that only explains what the reader already knows.",
      "Mark follow-up prompts instead of over-editing now.",
    ],
  },
];

export function WorkspaceModePanel() {
  const [workspaceMode, setWorkspaceMode] = useAtom(workspaceModeAtom);
  const [isPending, startTransition] = useTransition();

  const activePreset =
    workspacePresets.find((preset) => preset.value === workspaceMode) ??
    workspacePresets[0];

  return (
    <section className="rounded-[2rem] border border-border/80 bg-[#20140f] p-6 text-[#f8efe4] shadow-[0_20px_80px_rgba(22,16,10,0.2)]">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.22em] text-[#e2c5ad]/70">
            Jotai workspace state
          </p>
          <h2 className="text-2xl font-semibold">Shared mode switch</h2>
          <p className="max-w-lg text-sm leading-6 text-[#e2c5ad]/75">
            This panel changes local workspace behavior only. The selected mode
            is intentionally separate from server-fetched diary content.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {workspacePresets.map((preset) => {
            const isActive = preset.value === workspaceMode;

            return (
              <button
                key={preset.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  startTransition(() => {
                    setWorkspaceMode(preset.value);
                  });
                }}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-[#f8efe4]/15 bg-[#f8efe4] text-[#20140f]"
                    : "border-white/12 bg-white/4 text-[#f8efe4]/80 hover:bg-white/8",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold">{activePreset.title}</h3>
            <span className="text-sm text-[#e2c5ad]/70">
              {isPending ? "Updating..." : "State is instant and local"}
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#f8efe4]/76">
            {activePreset.description}
          </p>

          <ul className="mt-5 grid gap-3">
            {activePreset.focusPoints.map((item) => (
              <li
                key={item}
                className="rounded-[1rem] border border-white/10 bg-black/12 px-4 py-3 text-sm leading-6 text-[#f8efe4]/82"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
