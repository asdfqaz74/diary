import { Card } from "@/components/ui/card";
import { CalendarCard } from "@/features/dashboard/components/calendar-card";
import { EntryPreviewCard } from "@/features/dashboard/components/entry-preview-card";
import { GreetingHeader } from "@/features/dashboard/components/greeting-header";
import { MoodTrendCard } from "@/features/dashboard/components/mood-trend-card";
import { QuoteCard } from "@/features/dashboard/components/quote-card";
import { getDashboardData } from "@/features/dashboard/lib/get-dashboard-data";

export async function DashboardScreen() {
  const data = await getDashboardData();

  return (
    <main className="px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[78rem]">
        <GreetingHeader
          dateLabel={data.dateLabel}
          headline={data.headline}
          streak={data.streak}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-16">
            <CalendarCard months={data.calendarMonths} />

            <section>
              <h3 className="ml-4 font-headline text-4xl font-bold text-primary">
                최근 기록들
              </h3>
              {data.recentEntries.length > 0 ? (
                <div className="mt-10 grid gap-10 xl:grid-cols-2">
                  {data.recentEntries.map((entry, index) => (
                    <EntryPreviewCard
                      key={`${entry.dateLabel}-${entry.title}`}
                      index={index}
                      preview={entry}
                    />
                  ))}
                </div>
              ) : (
                <Card className="mt-10 p-10" tone="paper">
                  <h4 className="font-headline text-3xl font-bold text-on-surface">
                    아직 저장된 기록이 없습니다
                  </h4>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-on-surface-variant">
                    오른쪽 아래의 버튼이나 새 일기 쓰기 메뉴로 들어가 첫 기록을
                    남겨보세요.
                  </p>
                </Card>
              )}
            </section>
          </div>

          <div className="space-y-8 xl:pt-2">
            <MoodTrendCard points={data.moodTrend} />
            <QuoteCard author={data.quoteAuthor} quote={data.quoteText} />
          </div>
        </div>
      </div>
    </main>
  );
}
