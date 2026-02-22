import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isProjectOwner } from "@/lib/auth";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ owner: string; project: string }>;
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { owner, project } = await params;
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const hasAccess = await isProjectOwner(owner, project);

  if (!hasAccess) {
    redirect("/projects");
  }

  return <>{children}</>;
}
