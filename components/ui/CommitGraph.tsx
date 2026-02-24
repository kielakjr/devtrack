'use client';

import type { GitHubWeeklyActivity } from '@/lib/types/github';

interface Props {
  activity: GitHubWeeklyActivity[];
}

export default function CommitGraph({ activity }: Props) {
  const recent = activity.slice(-26);
  const maxTotal = Math.max(...recent.map((w) => w.total), 1);
  const totalCommits = recent.reduce((sum, w) => sum + w.total, 0);
  const avgPerWeek = (totalCommits / recent.length).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-0.5 h-24">
        {recent.map((week) => {
          const height = (week.total / maxTotal) * 100;
          const date = new Date(week.week * 1000);
          return (
            <div
              key={week.week}
              className="flex-1 bg-primary/60 hover:bg-primary rounded-t transition-colors cursor-default"
              style={{ height: `${Math.max(height, 2)}%` }}
              title={`Week ${date.toLocaleDateString("en-US")}: ${week.total} commits`}
            />
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-text/40">
        <span>
          {new Date(recent[0]?.week * 1000).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
        <span>
          {new Date(recent[recent.length - 1]?.week * 1000).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="flex gap-4 text-xs text-text/50">
        <span>
          Total: <strong className="text-primary">{totalCommits} commits</strong>
        </span>
        <span>
          Average: <strong className="text-primary">{avgPerWeek} / week</strong>
        </span>
      </div>
    </div>
  );
}
