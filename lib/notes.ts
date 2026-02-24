'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";

export interface ProjectNote {
  id: string;
  content: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotes(projectId: string): Promise<ProjectNote[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  return prisma.projectNote.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createNote(projectId: string, content: string): Promise<ProjectNote> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.userId !== session.user.id) throw new Error("Unauthorized");

  if (!content.trim()) throw new Error("Content is required");

  return prisma.projectNote.create({
    data: {
      content: content.trim(),
      projectId,
    },
  });
}

export async function updateNote(noteId: string, content: string): Promise<ProjectNote> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const note = await prisma.projectNote.findUnique({
    where: { id: noteId },
    include: { project: { select: { userId: true } } },
  });
  if (!note || note.project.userId !== session.user.id) throw new Error("Unauthorized");

  if (!content.trim()) throw new Error("Content is required");

  return prisma.projectNote.update({
    where: { id: noteId },
    data: { content: content.trim() },
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const note = await prisma.projectNote.findUnique({
    where: { id: noteId },
    include: { project: { select: { userId: true } } },
  });
  if (!note || note.project.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.projectNote.delete({ where: { id: noteId } });
}
