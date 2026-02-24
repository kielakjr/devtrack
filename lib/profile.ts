'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";
import { calculateStreak } from "@/util/streak";

export interface ProfileData {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
  stats: {
    totalMinutes: number;
    totalSessions: number;
    totalProjects: number;
    totalCourses: number;
    completedCourses: number;
    streak: number;
    longestSession: number;
    avgSessionMinutes: number;
    lastSessionAt: Date | null;
  };
  allSessions: {
    startedAt: Date;
    durationMinutes: number | null;
  }[];
}

export async function getProfileData(): Promise<ProfileData> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;

  const [
    user,
    allSessions,
    projectCount,
    courseCount,
    completedCourses,
    lastSession,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    }),

    prisma.studySession.findMany({
      where: { userId, endedAt: { not: null } },
      select: { startedAt: true, durationMinutes: true },
      orderBy: { startedAt: 'desc' },
    }),

    prisma.project.count({ where: { userId } }),
    prisma.course.count({ where: { userId } }),
    prisma.course.count({ where: { userId, status: 'COMPLETED' } }),

    prisma.studySession.findFirst({
      where: { userId, endedAt: { not: null } },
      orderBy: { startedAt: 'desc' },
      select: { startedAt: true },
    }),
  ]);

  if (!user) throw new Error("User not found");

  const totalMinutes = allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const longestSession = allSessions.reduce((max, s) => Math.max(max, s.durationMinutes || 0), 0);
  const avgSessionMinutes = allSessions.length > 0
    ? Math.round(totalMinutes / allSessions.length)
    : 0;

  return {
    user,
    stats: {
      totalMinutes,
      totalSessions: allSessions.length,
      totalProjects: projectCount,
      totalCourses: courseCount,
      completedCourses,
      streak: calculateStreak(allSessions.map((s) => s.startedAt)),
      longestSession,
      avgSessionMinutes,
      lastSessionAt: lastSession?.startedAt ?? null,
    },
    allSessions,
  };
}
