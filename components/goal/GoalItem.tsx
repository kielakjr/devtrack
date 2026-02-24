'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectGoal } from '@/lib/goals';

export default function GoalItem({
  goal,
  onToggle,
  onEdit,
  onDelete,
}: {
  goal: ProjectGoal;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const isOverdue = goal.targetDate && !goal.completed && new Date(goal.targetDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 p-3 rounded-lg border border-border group hover:border-primary/20 transition-colors"
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 size-4 rounded border cursor-pointer shrink-0 transition-colors ${
          goal.completed
            ? 'bg-primary border-primary'
            : 'border-border hover:border-primary/50'
        }`}
      >
        {goal.completed && (
          <span className="text-background text-[10px] flex items-center justify-center">✓</span>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm ${goal.completed ? 'text-text/30 line-through' : 'text-primary'}`}>
          {goal.title}
        </p>
        {goal.description && (
          <p className="text-xs text-text/50 mt-0.5">{goal.description}</p>
        )}
        {goal.targetDate && (
          <p className={`text-[11px] mt-1 ${isOverdue ? 'text-red-400' : 'text-text/40'}`}>
            {isOverdue ? 'Overdue: ' : 'Due: '}
            {new Date(goal.targetDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
        {goal.completedAt && (
          <p className="text-[11px] text-text/30 mt-1">
            Completed {new Date(goal.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onEdit}
          className="px-2 py-1 text-[11px] text-text/50 hover:text-primary hover:bg-secondary/30 rounded cursor-pointer transition-colors"
        >
          Edit
        </button>
        {confirming ? (
          <button
            onClick={() => { onDelete(); setConfirming(false); }}
            className="px-2 py-1 text-[11px] text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition-colors"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            onBlur={() => setConfirming(false)}
            className="px-2 py-1 text-[11px] text-text/50 hover:text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
