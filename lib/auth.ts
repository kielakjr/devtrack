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

export async function getAccountCreatedAt() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true },
  });

  if (!user) throw new Error("User not found");

  return user.createdAt;
}
