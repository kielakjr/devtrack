'use server';

import { prisma } from "./prisma";
import { getRepoDetailed } from "./github";

export async function syncProjectWithGitHub(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Project not found");

  if (
    project.lastSyncedAt &&
    Date.now() - project.lastSyncedAt.getTime() < 5 * 60 * 1000
  ) {
    return project;
  }

  try {
    const repo = await getRepoDetailed(project.githubOwner, project.githubName);

    return prisma.project.update({
      where: { id: projectId },
      data: {
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        lastCommitMsg: repo.last_commit?.message.split("\n")[0] ?? null,
        lastCommitDate: repo.last_commit ? new Date(repo.last_commit.date) : null,
        lastSyncedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(`Failed to sync project ${projectId}:`, error);
    return project;
  }
}
