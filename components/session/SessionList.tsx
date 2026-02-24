'use client';

import { StudySession } from '@/lib/sessions';
import Link from 'next/link';
import Stat from '@/components/ui/Stat';
import { fmt, formatDateTime } from '@/util/dateFormatting';

interface Stats {
  totalMinutes: number;
  totalHours: number;
  sessionCount: number;
  thisWeekMinutes: number;
  todayMinutes: number;
  byType: Record<string, number>;
  byProject: Record<string, number>;
}

interface Props {
  sessions: StudySession[];
  stats: Stats;
}

export default function SessionList({ sessions, stats }: Props) {
  const maxTypeMinutes = Math.max(...Object.values(stats.byType), 1);
  const maxProjectMinutes = Math.max(...Object.values(stats.byProject), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Today" value={fmt(stats.todayMinutes)} />
        <Stat label="This week" value={fmt(stats.thisWeekMinutes)} />
        <Stat label="Total" value={fmt(stats.totalMinutes)} />
        <Stat label="Sessions" value={stats.sessionCount.toString()} />
      </div>

      {Object.keys(stats.byType).length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text mb-3">By type</h3>
          <div className="space-y-2">
            {Object.entries(stats.byType)
              .sort(([, a], [, b]) => b - a)
              .map(([type, minutes]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-sm text-text w-24 lowercase">{type.toLowerCase()}</span>
                  <div className="flex-1 h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(minutes / maxTypeMinutes) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-text w-16 text-right">
                    {fmt(minutes)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {Object.keys(stats.byProject).length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text mb-3">By project</h3>
          <div className="space-y-2">
            {Object.entries(stats.byProject)
              .sort(([, a], [, b]) => b - a)
              .map(([name, minutes]) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-sm text-text w-24 truncate">{name}</span>
                  <div className="flex-1 h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all"
                      style={{ width: `${(minutes / maxProjectMinutes) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-text w-16 text-right">
                    {fmt(minutes)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {sessions.length > 0 ? (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-text mb-3">History</h3>
          <div className="space-y-px max-h-80 overflow-y-auto">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-secondary/20 rounded text-sm transition-colors"
              >
                <span className="text-xs text-text lowercase w-16">
                  {s.type.toLowerCase()}
                </span>

                <span className="font-mono text-xs text-primary w-14">
                  {s.endedAt ? fmt(s.durationMinutes ?? 1) : 'active'}
                </span>

                {s.project ? (
                  <Link
                    href={`/projects/${s.project.githubOwner}/${s.project.githubName}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {s.project.name}
                  </Link>
                ) : s.course ? (
                  <span className="text-xs text-primary/70">
                    {s.course.title}
                  </span>
                ) : (
                  <span className="text-xs text-text/30">—</span>
                )}

                {s.note && (
                  <span className="text-xs text-text/50 truncate flex-1">{s.note}</span>
                )}

                <span className="text-[11px] text-text/40 ml-auto whitespace-nowrap">
                  {formatDateTime(s.startedAt)}
                  {' → '}
                  {s.endedAt ? formatDateTime(s.endedAt) : 'ongoing'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-text/40">No sessions yet</p>
      )}
    </div>
  );
}
