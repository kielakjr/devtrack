'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";
import type { GitHubRepoBasic } from "./types/github";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  githubRepo: string;
  createdAt: Date;
  userId: string;
}

export const addProject = async (repo: GitHubRepoBasic) => {
  const session = await auth();
  if (!session?.user?.accessToken) throw new Error("No access token found");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) throw new Error("User not found");

  return prisma.project.create({
    data: {
      name: repo.name,
      description: repo.description || "",
      githubRepo: repo.html_url,
      userId: user.id,
    },
  });
};

export const getProjects = async (): Promise<Project[]> => {
  const session = await auth();
  if (!session?.user?.accessToken) throw new Error("No access token found");

  return prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteProject = async (projectId: string) => {
  const session = await auth();
  if (!session?.user?.accessToken) throw new Error("No access token found");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new Error("Project not found");
  if (project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id: projectId } });
};
