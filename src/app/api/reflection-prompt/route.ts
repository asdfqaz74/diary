import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const prompts = [
  {
    lens: "Attention",
    prompt:
      "Name the detail you almost skipped today, then explain why it deserves a full paragraph.",
  },
  {
    lens: "Contrast",
    prompt:
      "Write about a moment that looked ordinary from the outside but felt completely different from within.",
  },
  {
    lens: "Momentum",
    prompt:
      "Which unfinished thought has been following you all week, and what would happen if you answered it directly?",
  },
  {
    lens: "Revision",
    prompt:
      "Take a sentence you trust and rewrite it so the emotional center arrives one beat later.",
  },
];

export async function GET() {
  const promptIndex = Math.floor(Date.now() / 1000) % prompts.length;
  const selectedPrompt = prompts[promptIndex];

  return NextResponse.json(
    {
      ...selectedPrompt,
      generatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
