'use client';

import Link from 'next/link';
import type { DashboardData } from '@/lib/dashboard';

export default function UpcomingGoal({ goal }: { goal: NonNullable<DashboardData['upcomingGoal']> }) {
  const now = new Date();
  const target = new Date(goal.targetDate);
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);

  const isOverdue = diffDays < 0;
  const isUrgent = diffDays >= 0 && diffDays <= 3;

  return (
    <div className={`border rounded-lg p-4 ${
      isOverdue
        ? 'border-red-500/30 bg-red-500/5'
        : isUrgent
          ? 'border-yellow-500/30 bg-yellow-500/5'
          : 'border-border'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-text/50">Upcoming goal</span>
        <span className={`text-xs font-medium ${
          isOverdue
            ? 'text-red-400'
            : isUrgent
              ? 'text-yellow-400'
              : 'text-text/50'
        }`}>
          {isOverdue
            ? `${Math.abs(diffDays)}d overdue`
            : diffDays === 0
              ? 'Due today'
              : `${diffDays}d left`
          }
        </span>
      </div>

      <p className="text-sm font-medium text-primary">{goal.title}</p>

      {goal.description && (
        <p className="text-xs text-text/50 mt-0.5">{goal.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <Link
          href={`/projects`}
          className="text-[11px] text-text/40 hover:text-primary transition-colors"
        >
          {goal.projectName}
        </Link>
        <span className="text-[11px] text-text/30">
          {target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
