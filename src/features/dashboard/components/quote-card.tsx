import { Card } from "@/components/ui/card";
import { MaterialSymbol } from "@/components/ui/material-symbol";

type QuoteCardProps = {
  author: string;
  quote: string;
};

export function QuoteCard({ author, quote }: QuoteCardProps) {
  return (
    <Card className="relative overflow-hidden p-8" tone="ink">
      <MaterialSymbol
        className="absolute -right-3 -top-2 opacity-10"
        filled
        name="format_quote"
        opticalSize={92}
        weight={500}
      />
      <p className="max-w-xs whitespace-pre-line font-headline text-3xl italic leading-[1.55] text-on-primary">
        {quote}
      </p>
      <p className="mt-6 font-label text-lg text-on-primary/70">— {author}</p>
    </Card>
  );
}
