import { MaterialSymbol } from "@/components/ui/material-symbol";

type WeatherSymbolProps = {
  className?: string;
  filled?: boolean;
  name: string;
  opticalSize?: number;
};

type BaseIconProps = {
  className?: string;
  size: number;
};

function BaseIcon({ children, className, size }: React.PropsWithChildren<BaseIconProps>) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

function SunnyIcon({ className, size }: BaseIconProps) {
  return (
    <BaseIcon className={className} size={size}>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.75V5" />
      <path d="M12 19V21.25" />
      <path d="M4.75 12H7" />
      <path d="M17 12H19.25" />
      <path d="M5.9 5.9L7.5 7.5" />
      <path d="M16.5 16.5L18.1 18.1" />
      <path d="M16.5 7.5L18.1 5.9" />
      <path d="M5.9 18.1L7.5 16.5" />
    </BaseIcon>
  );
}

function CloudIcon({ className, filled, size }: BaseIconProps & { filled?: boolean }) {
  return (
    <BaseIcon className={className} size={size}>
      {filled ? (
        <path
          d="M6.5 17.5h10a3.5 3.5 0 0 0 .33-6.98A5 5 0 0 0 7.33 8.72 3.5 3.5 0 0 0 6.5 17.5Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="none"
        />
      ) : null}
      <path d="M6.5 17.5h10a3.5 3.5 0 0 0 .33-6.98A5 5 0 0 0 7.33 8.72 3.5 3.5 0 0 0 6.5 17.5Z" />
    </BaseIcon>
  );
}

function RainyIcon({ className, size }: BaseIconProps) {
  return (
    <BaseIcon className={className} size={size}>
      <path d="M6.5 15.5h10a3.5 3.5 0 0 0 .33-6.98A5 5 0 0 0 7.33 6.72 3.5 3.5 0 0 0 6.5 15.5Z" />
      <path d="M9 18.5 8.15 20.75" />
      <path d="M12.25 18.5 11.4 20.75" />
      <path d="M15.5 18.5 14.65 20.75" />
    </BaseIcon>
  );
}

function SnowIcon({ className, size }: BaseIconProps) {
  return (
    <BaseIcon className={className} size={size}>
      <path d="M12 4.5v15" />
      <path d="M5.5 8.25 18.5 15.75" />
      <path d="M5.5 15.75 18.5 8.25" />
      <path d="m12 4.5 1.5 1.5" />
      <path d="m12 4.5-1.5 1.5" />
      <path d="m12 19.5 1.5-1.5" />
      <path d="m12 19.5-1.5-1.5" />
      <path d="m5.5 8.25 2 .25" />
      <path d="m5.5 8.25.9 1.8" />
      <path d="m18.5 15.75-2-.25" />
      <path d="m18.5 15.75-.9-1.8" />
      <path d="m5.5 15.75 2-.25" />
      <path d="m5.5 15.75.9-1.8" />
      <path d="m18.5 8.25-2 .25" />
      <path d="m18.5 8.25-.9 1.8" />
    </BaseIcon>
  );
}

export function WeatherSymbol({
  className,
  filled = false,
  name,
  opticalSize = 28,
}: WeatherSymbolProps) {
  if (name === "wb_sunny") {
    return <SunnyIcon className={className} size={opticalSize} />;
  }

  if (name === "cloud") {
    return <CloudIcon className={className} filled={filled} size={opticalSize} />;
  }

  if (name === "rainy") {
    return <RainyIcon className={className} size={opticalSize} />;
  }

  if (name === "ac_unit") {
    return <SnowIcon className={className} size={opticalSize} />;
  }

  return (
    <MaterialSymbol
      className={className}
      filled={filled}
      name={name}
      opticalSize={opticalSize}
      weight={350}
    />
  );
}
