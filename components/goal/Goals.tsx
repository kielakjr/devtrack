'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ProjectGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/goals';

interface Props {
  projectId: string;
  initialGoals: ProjectGoal[];
}

export default function Goals({ projectId, initialGoals }: Props) {
  const [goals, setGoals] = useState(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const pending = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  const handleCreate = async (data: { title: string; description?: string; targetDate?: string }) => {
    const goal = await createGoal(projectId, data);
    setGoals((prev) => [goal, ...prev]);
    setShowForm(false);
  };

  const handleToggle = async (goal: ProjectGoal) => {
    const updated = await updateGoal(goal.id, { completed: !goal.completed });
    setGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? updated : g))
    );
  };

  const handleUpdate = async (goalId: string, data: Parameters<typeof updateGoal>[1]) => {
    const updated = await updateGoal(goalId, data);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? updated : g)));
    setEditingId(null);
  };

  const handleDelete = async (goalId: string) => {
    await deleteGoal(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text/50">
          {pending.length} pending · {completed.length} completed
        </span>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="text-xs text-primary hover:underline cursor-pointer"
        >
          {showForm ? 'Cancel' : '+ Add goal'}
        </button>
      </div>

      {showForm && (
        <GoalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {pending.map((goal) => (
            editingId === goal.id ? (
              <GoalForm
                key={goal.id}
                initialData={goal}
                onSubmit={(data) => handleUpdate(goal.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggle={() => handleToggle(goal)}
                onEdit={() => setEditingId(goal.id)}
                onDelete={() => handleDelete(goal.id)}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {completed.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="text-[11px] text-text/30 uppercase tracking-wider">Completed</span>
          <AnimatePresence>
            {completed.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggle={() => handleToggle(goal)}
                onEdit={() => setEditingId(goal.id)}
                onDelete={() => handleDelete(goal.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {goals.length === 0 && !showForm && (
        <p className="text-sm text-text/30 text-center py-4">No goals yet</p>
      )}
    </div>
  );
}

function GoalItem({
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

function GoalForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: ProjectGoal;
  onSubmit: (data: { title: string; description?: string; targetDate?: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [targetDate, setTargetDate] = useState(
    initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : ''
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        targetDate: targetDate || undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-3 space-y-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title"
        autoFocus
        className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-primary placeholder:text-text/30 focus:outline-none focus:border-primary"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex items-center justify-between">
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="px-3 py-1.5 border border-border rounded text-xs bg-background text-text focus:outline-none focus:border-primary"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-text hover:bg-secondary/30 rounded cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || submitting}
            className="px-3 py-1.5 text-xs bg-primary text-background rounded cursor-pointer hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {initialData ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}
