type DashboardSymbolProps = {
  className?: string;
};

export function QuoteSymbol({ className }: DashboardSymbolProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      focusable="false"
      viewBox="0 0 96 96"
    >
      <path d="M18 61c0-16 9-31 25-41l8 9c-9 6-14 13-16 21h16v28H18V61Z" />
      <path d="M53 61c0-16 9-31 25-41l8 9c-9 6-14 13-16 21h16v28H53V61Z" />
    </svg>
  );
}
