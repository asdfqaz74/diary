import type { Metadata } from "next";
import { Manrope, Noto_Serif_KR } from "next/font/google";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/ui/app-shell";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-diary-serif",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-diary-label",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "명상 메모아",
  description: "Supabase 인증과 기록 보관이 연결된 명상 다이어리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/fonts/material-symbols-outlined.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
