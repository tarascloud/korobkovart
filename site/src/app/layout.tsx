import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://korobkovart.com"
  ),
  title: "Korobkov Art Studio",
  description:
    "Contemporary Ukrainian art studio. Original paintings, murals, and installations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "Korobkov Art Studio",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://korobkovart.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
