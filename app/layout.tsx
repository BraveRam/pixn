import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pixn — Search your photos by meaning",
    template: "%s · Pixn",
  },
  description:
    "Pixn is an AI-powered image gallery with semantic search. Upload your photos and find any of them by describing what's in them — no folders, no tags, no endless scrolling.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Pixn — Search your photos by meaning",
    description:
      "Upload your photos and find any of them by describing what's in them. AI-powered semantic search for your personal gallery.",
    url: siteUrl,
    siteName: "Pixn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixn — Search your photos by meaning",
    description:
      "AI-powered semantic search for your personal image gallery. Find photos by describing them.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground min-h-screen transition-colors duration-300`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
