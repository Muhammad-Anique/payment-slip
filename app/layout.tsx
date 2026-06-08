import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payment Slip Generator",
  description: "Generate professional payment receipts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
