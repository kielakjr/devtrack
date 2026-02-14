import type { Metadata } from "next";
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
            {children}
        </Providers>
      </body>
    </html>
  );
}
