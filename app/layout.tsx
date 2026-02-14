import type { Metadata } from "next";
import Topbar from "@/components/layout/Topbar";
import "@/app/globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "DevTrack",
  description: "A project management tool built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-primary">
        <Providers>
          <Topbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
