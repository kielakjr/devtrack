'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";

export interface Course {
  id: string;
  title: string;
  platform: string | null;
  url: string | null;
  totalHours: number | null;
  status: string;
  progress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    sessions: number;
  };
  totalMinutes: number;
}

export interface CreateCourseInput {
  title: string;
  platform?: string;
  url?: string;
  totalHours?: number;
}

export interface UpdateCourseInput {
  title?: string;
  platform?: string | null;
  url?: string | null;
  totalHours?: number | null;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
  progress?: number;
}

export async function getCourses(): Promise<Course[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const courses = await prisma.course.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { sessions: true } },
      sessions: {
        select: { durationMinutes: true },
        where: { endedAt: { not: null } },
      },
    },
  });

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    platform: c.platform,
    url: c.url,
    totalHours: c.totalHours,
    status: c.status,
    progress: c.progress,
    userId: c.userId,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    _count: c._count,
    totalMinutes: c.sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
  }));
}

export async function createCourse(input: CreateCourseInput): Promise<Course> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  if (!input.title.trim()) throw new Error("Title is required");

  const course = await prisma.course.create({
    data: {
      title: input.title.trim(),
      platform: input.platform?.trim() || null,
      url: input.url?.trim() || null,
      totalHours: input.totalHours || null,
      userId: session.user.id,
    },
    include: {
      _count: { select: { sessions: true } },
    },
  });

  return { ...course, totalMinutes: 0 };
}

export async function updateCourse(courseId: string, input: UpdateCourseInput): Promise<Course> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.userId !== session.user.id) throw new Error("Unauthorized");

  if (input.progress !== undefined) {
    input.progress = Math.min(100, Math.max(0, input.progress));
  }

  // Auto-complete when progress hits 100
  if (input.progress === 100 && course.status !== 'COMPLETED') {
    input.status = 'COMPLETED';
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: input.title?.trim(),
      platform: input.platform !== undefined ? (input.platform?.trim() || null) : undefined,
      url: input.url !== undefined ? (input.url?.trim() || null) : undefined,
      totalHours: input.totalHours !== undefined ? input.totalHours : undefined,
      status: input.status as any,
      progress: input.progress,
    },
    include: {
      _count: { select: { sessions: true } },
      sessions: {
        select: { durationMinutes: true },
        where: { endedAt: { not: null } },
      },
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    platform: updated.platform,
    url: updated.url,
    totalHours: updated.totalHours,
    status: updated.status,
    progress: updated.progress,
    userId: updated.userId,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    _count: updated._count,
    totalMinutes: updated.sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
  };
}

export async function deleteCourse(courseId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.course.delete({ where: { id: courseId } });
}
