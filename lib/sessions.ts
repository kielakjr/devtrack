'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";

export interface StudySession {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number | null;
  type: string;
  note: string | null;
  projectId: string | null;
  courseId: string | null;
  project: { id: string; name: string; githubOwner: string; githubName: string } | null;
  course: { id: string; title: string } | null;
  createdAt: Date;
}

const sessionInclude = {
  project: { select: { id: true, name: true, githubOwner: true, githubName: true } },
  course: { select: { id: true, title: true } },
} as const;

export async function startSession(
  type: "CODING" | "LEARNING" | "DEBUGGING" | "REVIEWING" | "PLANNING" = "CODING",
  projectId?: string,
  courseId?: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const active = await prisma.studySession.findFirst({
    where: { userId: session.user.id, endedAt: null },
  });
  if (active) throw new Error("You already have an active session");

  if (projectId && courseId) throw new Error("Choose project or course, not both");

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) throw new Error("Project not found");
  }

  if (courseId) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: session.user.id },
    });
    if (!course) throw new Error("Course not found");
  }

  return prisma.studySession.create({
    data: {
      startedAt: new Date(),
      type,
      userId: session.user.id,
      projectId: projectId || null,
      courseId: courseId || null,
    },
    include: sessionInclude,
  });
}

export async function stopSession(sessionId: string, note?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const studySession = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!studySession || studySession.userId !== session.user.id) throw new Error("Unauthorized");
  if (studySession.endedAt) throw new Error("Session already ended");

  const endedAt = new Date();
  const durationMinutes = Math.max(
    1,
    Math.round((endedAt.getTime() - studySession.startedAt.getTime()) / 60_000)
  );

  return prisma.studySession.update({
    where: { id: sessionId },
    data: { endedAt, durationMinutes, note: note || null },
    include: sessionInclude,
  });
}

export async function updateSessionContext(
  sessionId: string,
  context: { projectId?: string | null; courseId?: string | null }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const studySession = await prisma.studySession.findUnique({
    where: { id: sessionId },
  });
  if (!studySession || studySession.userId !== session.user.id) throw new Error("Unauthorized");

  if (context.projectId && context.courseId) {
    throw new Error("Choose project or course, not both");
  }

  return prisma.studySession.update({
    where: { id: sessionId },
    data: {
      projectId: context.projectId !== undefined ? context.projectId : studySession.projectId,
      courseId: context.courseId !== undefined ? context.courseId : studySession.courseId,
    },
    include: sessionInclude,
  });
}

export async function getActiveSession(): Promise<StudySession | null> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.studySession.findFirst({
    where: { userId: session.user.id, endedAt: null },
    include: sessionInclude,
  });
}

export async function getRecentSessions(limit = 20): Promise<StudySession[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.studySession.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
    take: limit,
    include: sessionInclude,
  });
}

export async function getSessionsByProject(projectId: string): Promise<StudySession[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.studySession.findMany({
    where: { projectId, userId: session.user.id },
    orderBy: { startedAt: "desc" },
    include: sessionInclude,
  });
}

export async function getGlobalStats() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const sessions = await prisma.studySession.findMany({
    where: { userId: session.user.id, durationMinutes: { not: null } },
    select: {
      durationMinutes: true,
      type: true,
      startedAt: true,
      project: { select: { name: true } },
      course: { select: { title: true } },
    },
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  const byType = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + (s.durationMinutes || 0);
    return acc;
  }, {});

  const byProject = sessions.reduce<Record<string, number>>((acc, s) => {
    const key = s.project?.name || s.course?.title || "No context";
    acc[key] = (acc[key] || 0) + (s.durationMinutes || 0);
    return acc;
  }, {});

  const weekAgo = new Date(Date.now() - 7 * 86_400_000);
  const thisWeek = sessions
    .filter((s) => s.startedAt >= weekAgo)
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const today = sessions
    .filter((s) => s.startedAt >= todayStart)
    .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

  return {
    totalMinutes,
    totalHours: Math.round(totalMinutes / 6) / 10,
    sessionCount: sessions.length,
    thisWeekMinutes: thisWeek,
    todayMinutes: today,
    byType,
    byProject,
  };
}

export async function getSessionContextOptions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const [projects, courses] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id, status: "ACTIVE" },
      select: { id: true, name: true, githubOwner: true, githubName: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.course.findMany({
      where: { userId: session.user.id, status: "IN_PROGRESS" },
      select: { id: true, title: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return { projects, courses };
}

export async function getAllSessions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return prisma.studySession.findMany({
    where: { userId: session.user.id },
    select: {
      startedAt: true,
      durationMinutes: true,
    },
    orderBy: { startedAt: "desc" },
  });
}
