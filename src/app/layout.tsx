import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FutureScope — AI Prediction Timeline",
  description: "Explore the ripple effects of world events with AI-powered future prediction timelines",
  icons: {
    icon: [
      { url: "/futurescope/favicon.ico", sizes: "32x32" },
      { url: "/futurescope/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/futurescope/apple-touch-icon.png",
  },
  manifest: "/futurescope/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
