'use server';
import { auth } from "@/auth";
import { GitHubRepo } from "./github";
import { prisma } from "./prisma";

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

