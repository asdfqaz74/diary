import { Card } from "@/components/ui/card";
import { QuoteSymbol } from "@/features/dashboard/components/dashboard-symbols";

type QuoteCardProps = {
  author: string;
  quote: string;
};

export function QuoteCard({ author, quote }: QuoteCardProps) {
  return (
    <Card className="relative overflow-hidden p-8" tone="ink">
      <QuoteSymbol className="absolute -right-3 -top-2 h-[92px] w-[92px] opacity-10" />
      <p className="max-w-xs whitespace-pre-line font-headline text-3xl italic leading-[1.55] text-on-primary">
        {quote}
      </p>
      <p className="mt-6 font-label text-lg text-on-primary/70">
        글 · {author}
      </p>
    </Card>
  );
}
