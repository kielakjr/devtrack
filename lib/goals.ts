'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";

export interface ProjectGoal {
  id: string;
  title: string;
  description: string | null;
  targetDate: Date | null;
  completed: boolean;
  completedAt: Date | null;
  projectId: string;
  createdAt: Date;
}

export async function getGoals(projectId: string): Promise<ProjectGoal[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  return prisma.projectGoal.findMany({
    where: { projectId },
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createGoal(projectId: string, input: {
  title: string;
  description?: string;
  targetDate?: string;
}): Promise<ProjectGoal> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  if (!input.title.trim()) throw new Error("Title is required");

  return prisma.projectGoal.create({
    data: {
      title: input.title.trim(),
      description: input.description?.trim() || null,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      projectId,
    },
  });
}

export async function updateGoal(goalId: string, input: {
  title?: string;
  description?: string | null;
  targetDate?: string | null;
  completed?: boolean;
}): Promise<ProjectGoal> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const goal = await prisma.projectGoal.findUnique({
    where: { id: goalId },
    include: { project: { select: { userId: true } } },
  });
  if (!goal || goal.project.userId !== session.user.id) throw new Error("Unauthorized");

  return prisma.projectGoal.update({
    where: { id: goalId },
    data: {
      title: input.title?.trim(),
      description: input.description !== undefined ? (input.description?.trim() || null) : undefined,
      targetDate: input.targetDate !== undefined ? (input.targetDate ? new Date(input.targetDate) : null) : undefined,
      completed: input.completed,
      completedAt: input.completed === true ? new Date() : input.completed === false ? null : undefined,
    },
  });
}

export async function deleteGoal(goalId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const goal = await prisma.projectGoal.findUnique({
    where: { id: goalId },
    include: { project: { select: { userId: true } } },
  });
  if (!goal || goal.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.projectGoal.delete({ where: { id: goalId } });
}
