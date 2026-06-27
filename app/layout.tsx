import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const headingFont = Fraunces({
  variable: "--font-heading-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Outfit({
  variable: "--font-body-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Sweet bakery in Rotterdam",
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${headingFont.variable} ${bodyFont.variable} h-full`}>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-body antialiased">
        {children}
      </body>
    </html>
  );
}
