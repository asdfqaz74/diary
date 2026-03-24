import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { EntryDetailData } from "@/features/entries/types";

type EntryDetailScreenProps = {
  data: EntryDetailData;
  deleteAction?: () => Promise<void>;
};

function ActionLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-label text-sm font-semibold text-on-primary transition hover:bg-primary-dim"
    >
      <MaterialSymbol
        className="text-on-primary"
        name={icon}
        opticalSize={18}
      />
      <span>{label}</span>
    </Link>
  );
}

export function EntryDetailScreen({
  data,
  deleteAction,
}: EntryDetailScreenProps) {
  const primaryActionLabel =
    data.kind === "entry" ? "수정하기" : "이 날짜에 기록 쓰기";

  return (
    <main className="px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[74rem]">
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-label text-sm uppercase tracking-[0.24em] text-on-surface-variant">
              {data.subtitle}
            </p>
            <h1 className="font-headline text-5xl font-black tracking-tight text-primary md:text-7xl">
              {data.dateLabel}
            </h1>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3 self-center text-white md:w-auto md:justify-end md:self-auto">
            <ActionLink
              href={data.editHref}
              icon={data.kind === "entry" ? "edit" : "add"}
              label={primaryActionLabel}
            />
            {data.kind === "entry" && deleteAction ? (
              <form action={deleteAction}>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(92,111,97,0.18)] px-5 py-3 font-label text-sm font-semibold text-primary transition hover:bg-surface-container-low"
                >
                  <MaterialSymbol name="delete" opticalSize={18} weight={350} />
                  <span>삭제하기</span>
                </button>
              </form>
            ) : null}
          </div>
        </header>

        {data.kind === "entry" ? (
          <Card className={`p-8 md:p-12 ${data.paperClassName}`} tone="paper">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-surface-container px-4 py-2 font-label text-sm text-primary">
                마음 {data.moodLabel}
              </span>
              <span className="rounded-full bg-surface-container px-4 py-2 font-label text-sm text-primary">
                날씨 {data.weatherLabel}
              </span>
            </div>

            <h2 className="mt-8 font-headline text-4xl font-bold leading-tight text-on-surface md:text-5xl">
              {data.title || "제목 없는 기록"}
            </h2>

            <div className="mt-8 whitespace-pre-wrap text-lg leading-[1.95] text-on-surface-variant md:text-xl">
              {data.body || "이 날짜에는 아직 본문이 없습니다."}
            </div>

            <footer className="mt-12 flex flex-col gap-4 border-t border-[rgba(176,179,174,0.08)] pt-8 font-label text-sm text-outline md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <span className="flex items-center gap-1.5">
                  <MaterialSymbol name="schedule" opticalSize={18} />
                  {data.savedAtLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <MaterialSymbol name="location_on" opticalSize={18} />
                  {data.locationLabel}
                </span>
              </div>
              <Link
                href="/"
                className="font-label text-sm font-semibold text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95 duration-150 transition-transform"
              >
                홈으로 돌아가기
              </Link>
            </footer>
          </Card>
        ) : (
          <Card className="p-8 md:p-12" tone="paper">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
              <MaterialSymbol name="book_2" opticalSize={30} weight={350} />
            </div>
            <h2 className="mt-8 font-headline text-4xl font-bold text-on-surface">
              아직 이 날짜의 기록이 없어요
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-on-surface-variant">
              과거와 미래 날짜도 자유롭게 남길 수 있습니다. 이 날짜에 첫 기록을
              쓰고 싶다면 바로 작성 화면으로 이동해 보세요.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <ActionLink
                href={data.editHref}
                icon="edit_note"
                label="이 날짜에 기록 쓰기"
              />
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[rgba(92,111,97,0.18)] px-5 py-3 font-label text-sm font-semibold text-primary transition hover:bg-surface-container-low"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
