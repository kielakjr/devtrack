'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";

export interface DashboardData {
  user: {
    name: string | null;
    createdAt: Date;
  };
  stats: {
    totalMinutes: number;
    todayMinutes: number;
    thisWeekMinutes: number;
    streak: number;
    totalSessions: number;
    totalProjects: number;
    totalCourses: number;
    completedCourses: number;
  };
  recentProjects: {
    id: string;
    name: string;
    githubOwner: string;
    githubName: string;
    updatedAt: Date;
  }[];
  activeCourses: {
    id: string;
    title: string;
    platform: string | null;
    progress: number;
    totalHours: number | null;
    totalMinutes: number;
  }[];
  recentSessions: {
    id: string;
    type: string;
    durationMinutes: number | null;
    startedAt: Date;
    endedAt: Date | null;
    note: string | null;
    projectName: string | null;
    courseTitle: string | null;
  }[];
  allSessions: {
    startedAt: Date;
    durationMinutes: number | null;
  }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  const [
    user,
    allSessions,
    todaySessions,
    weekSessions,
    projectCount,
    courseCount,
    completedCourses,
    recentProjects,
    activeCourses,
    recentSessionsRaw,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, createdAt: true },
    }),

    prisma.studySession.findMany({
      where: { userId, endedAt: { not: null } },
      select: { startedAt: true, durationMinutes: true },
      orderBy: { startedAt: 'desc' },
    }),

    prisma.studySession.findMany({
      where: { userId, endedAt: { not: null }, startedAt: { gte: todayStart } },
      select: { durationMinutes: true },
    }),

    prisma.studySession.findMany({
      where: { userId, endedAt: { not: null }, startedAt: { gte: weekStart } },
      select: { durationMinutes: true },
    }),

    prisma.project.count({ where: { userId } }),
    prisma.course.count({ where: { userId } }),
    prisma.course.count({ where: { userId, status: 'COMPLETED' } }),

    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        name: true,
        githubOwner: true,
        githubName: true,
        updatedAt: true,
      },
    }),

    prisma.course.findMany({
      where: { userId, status: 'IN_PROGRESS' },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      include: {
        sessions: {
          select: { durationMinutes: true },
          where: { endedAt: { not: null } },
        },
      },
    }),

    prisma.studySession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: {
        project: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
  ]);

  const totalMinutes = allSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const thisWeekMinutes = weekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const streak = calculateStreak(allSessions.map((s) => s.startedAt));

  return {
    user: { name: user?.name ?? null, createdAt: user!.createdAt },
    stats: {
      totalMinutes,
      todayMinutes,
      thisWeekMinutes,
      streak,
      totalSessions: allSessions.length,
      totalProjects: projectCount,
      totalCourses: courseCount,
      completedCourses,
    },
    recentProjects,
    activeCourses: activeCourses.map((c) => ({
      id: c.id,
      title: c.title,
      platform: c.platform,
      progress: c.progress,
      totalHours: c.totalHours,
      totalMinutes: c.sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
    })),
    recentSessions: recentSessionsRaw.map((s) => ({
      id: s.id,
      type: s.type,
      durationMinutes: s.durationMinutes,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      note: s.note,
      projectName: s.project?.name ?? null,
      courseTitle: s.course?.title ?? null,
    })),
    allSessions,
  };
}

function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const daySet = new Set<string>();
  for (const d of dates) {
    const date = new Date(d);
    daySet.add(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let cursor = new Date(today);
  if (!daySet.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
    const yKey = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!daySet.has(yKey)) return 0;
  }

  let streak = 0;
  while (true) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (!daySet.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
