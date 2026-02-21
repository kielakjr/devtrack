import Sidebar from "@/components/layout/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen bg-background text-primary">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
    </div>
  )
}
