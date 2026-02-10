import type { Metadata } from "next";
import Topbar from "@/components/Topbar";
import "@/app/globals.css";
import Sidebar from "@/components/Sidebar";

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
        <Topbar />
        <main className="flex">
          <Sidebar />
          {children}
        </main>
      </body>
    </html>
  );
}
