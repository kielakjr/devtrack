'use server';
import { auth } from "@/auth";
import { GitHubRepo } from "./github";
import { prisma } from "./prisma";

export interface Project {
  id: string;
  name: string;
  description: string;
  githubRepo: string;
  createdAt: Date;
}

export const addProject = async (repo: GitHubRepo) => {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await prisma.project.create({
    data: {
      name: repo.name,
      description: repo.description || "",
      githubRepo: repo.html_url,
      userId: user.id,
    },
  });

  return project;
}

export const getProjects = async (): Promise<Project[]> => {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export const deleteProject = async (projectId: string) => {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });
}
