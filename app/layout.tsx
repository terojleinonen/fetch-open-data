import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Geist,
  Geist_Mono,
  Source_Serif_4,
} from "next/font/google";
import { Header, Footer } from "@/components/SiteChrome";
import "./globals.css";
import "./covers.css";
import "./connections.css";
import "./archive-explorer.css";
import "./places.css";
import "./editorial.css";
import "./timeline.css";
import "./catalogues.css";
import "./generated-art.css";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const display = Bodoni_Moda({ variable: "--font-display", subsets: ["latin"] });
const serif = Source_Serif_4({ variable: "--font-serif", subsets: ["latin"] });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(
    siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`,
  ),
  title: {
    default: "Stephen King Universe",
    template: "%s — Stephen King Universe",
  },
  description:
    "Explore the works, characters, adaptations and hidden connections across Stephen King's universe.",
  openGraph: {
    title: "Stephen King Universe",
    description: "Every story leaves a trace.",
    images: [{ url: "/og.jpeg", width: 1200, height: 628 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stephen King Universe",
    description: "Every story leaves a trace.",
    images: ["/og.jpeg"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="noir" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${mono.variable} ${display.variable} ${serif.variable}`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
