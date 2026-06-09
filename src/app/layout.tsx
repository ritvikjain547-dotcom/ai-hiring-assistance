import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireAI — AI-Powered Recruitment Platform",
  description:
    "Screen, evaluate, and shortlist candidates faster with artificial intelligence. The modern recruitment platform for forward-thinking companies.",
  keywords: [
    "recruitment",
    "hiring",
    "AI",
    "candidates",
    "jobs",
    "screening",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="bg-mesh" />
        <div className="bg-grid" />
        {children}
      </body>
    </html>
  );
}
