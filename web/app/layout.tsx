import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "KabadiConnect | Smart recycling",
  description: "India's smart recycling network",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
