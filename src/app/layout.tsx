import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-black">{children}</body>
    </html>
  );
}
