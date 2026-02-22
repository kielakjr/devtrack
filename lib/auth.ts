'use server';
import { signIn, signOut } from "@/auth"
import { auth } from "@/auth";
import { prisma } from "./prisma";

export const login = async () => {
  await signIn("github", { redirectTo: "/dashboard" })
}

export const logout = async () => {
  await signOut({ redirectTo: "/" })
}

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session) return null;
  return session.user;
}

export const getUserName = async () => {
  const user = await getCurrentUser();
  if (!user) return "Guest";
  return user?.name || "Unnamed User";
}

export async function isProjectOwner(
  owner: string,
  projectName: string
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const project = await prisma.project.findFirst({
    where: {
      userId: session.user.id,
      githubOwner: owner,
      githubName: projectName,
    },
  });

  return !!project;
}
