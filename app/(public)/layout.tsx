import Sidebar from "@/components/layout/Sidebar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-primary">
      <main className="flex">
        <Sidebar />
        {children}
      </main>
    </div>
  )
}
