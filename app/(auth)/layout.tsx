import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "DevTrack",
  description: "Login or register to access your DevTrack dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background flex items-center justify-center min-h-screen">{children}</body>
    </html>
  )
}
