import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vetum — agents propose, policy decides",
  description:
    "Programmable control plane for Binance Agent OS. Not a trading bot.",
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void text-bone antialiased">{children}</body>
    </html>
  );
}
