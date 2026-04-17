import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korobkov Art Studio",
  description:
    "Contemporary Ukrainian art studio. Original paintings, murals, and installations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
