'use client';

import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard';
import SessionGraph from '@/components/session/SessionGraph';
import SessionTimer from '@/components/session/SessionTimer';
import Stat from '../ui/Stat';
import { fmt, relative } from '@/util/dateFormatting';

interface Props {
  data: DashboardData;
  sessionOptions: {
    projects: { id: string; name: string; githubOwner: string; githubName: string }[];
    courses: { id: string; title: string }[];
  };
  activeSession: any;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard({ data, sessionOptions, activeSession }: Props) {
  const { user, stats, recentProjects, activeCourses, recentSessions, allSessions } = data;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {greeting()}{user.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-text mt-1">
          {stats.streak > 0
            ? `${stats.streak} day streak 🔥`
            : 'Start a session to begin your streak'}
        </p>
      </div>

      <SessionTimer options={sessionOptions} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Today" value={fmt(stats.todayMinutes)} />
        <Stat label="This week" value={fmt(stats.thisWeekMinutes)} />
        <Stat label="Total" value={fmt(stats.totalMinutes)} />
        <Stat label="Sessions" value={stats.totalSessions.toString()} />
      </div>

      <Card title="Activity">
        <SessionGraph sessions={allSessions} accountCreatedAt={user.createdAt} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent projects"
          action={stats.totalProjects > 0 ? { label: `All (${stats.totalProjects})`, href: '/projects' } : undefined}
        >
          {recentProjects.length > 0 ? (
            <div className="space-y-2">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.githubOwner}/${p.githubName}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-medium text-primary truncate">{p.name}</p>
                  <span className="text-[11px] text-text/40 shrink-0 ml-2">
                    {relative(p.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <Empty text="No projects yet" href="/projects" link="Add a project" />
          )}
        </Card>

        <Card
          title="Active courses"
          action={stats.totalCourses > 0 ? { label: `All (${stats.totalCourses})`, href: '/courses' } : undefined}
        >
          {activeCourses.length > 0 ? (
            <div className="space-y-2">
              {activeCourses.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-primary truncate">{c.title}</p>
                    <span className="text-[11px] text-text/40 shrink-0 ml-2">
                      {Math.round(c.progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-text/50">
                    {c.platform && <span>{c.platform}</span>}
                    {c.totalMinutes > 0 && <span>{fmt(c.totalMinutes)} spent</span>}
                    {c.totalHours && <span>{c.totalHours}h total</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="No active courses" href="/courses" link="Add a course" />
          )}
        </Card>
      </div>

      <Card
        title="Recent sessions"
        action={stats.totalSessions > 0 ? { label: 'All sessions', href: '/sessions' } : undefined}
      >
        {recentSessions.length > 0 ? (
          <div className="space-y-px">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-secondary/20 transition-colors"
              >
                <span className="text-xs text-text/60 lowercase w-16">{s.type.toLowerCase()}</span>
                <span className="font-mono text-xs text-primary w-14">
                  {s.endedAt ? fmt(s.durationMinutes ?? 1) : 'active'}
                </span>
                <span className="text-xs text-primary/70 truncate flex-1">
                  {s.projectName || s.courseTitle || '—'}
                </span>
                {s.note && (
                  <span className="text-xs text-text/30 truncate max-w-40">{s.note}</span>
                )}
                <span className="text-[11px] text-text/40 shrink-0">{relative(s.startedAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text/40 text-center py-4">No sessions yet</p>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Link href="/projects" className="border border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors">
          <p className="text-lg font-bold text-primary">{stats.totalProjects}</p>
          <p className="text-xs text-text mt-1">Projects</p>
        </Link>
        <Link href="/courses" className="border border-border rounded-lg p-4 text-center hover:border-primary/30 transition-colors">
          <p className="text-lg font-bold text-primary">
            {stats.completedCourses}/{stats.totalCourses}
          </p>
          <p className="text-xs text-text mt-1">Courses completed</p>
        </Link>
        <div className="border border-border rounded-lg p-4 text-center">
          <p className="text-lg font-bold text-primary">
            {stats.streak}d {stats.streak > 0 && '🔥'}
          </p>
          <p className="text-xs text-text mt-1">Streak</p>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg p-4 overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-wider text-text">{title}</h2>
        {action && (
          <Link href={action.href} className="text-xs text-primary hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Empty({ text, href, link }: { text: string; href: string; link: string }) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-text/40 mb-2">{text}</p>
      <Link href={href} className="text-xs text-primary hover:underline">{link} →</Link>
    </div>
  );
}
