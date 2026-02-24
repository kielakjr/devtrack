'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  ProjectGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/goals';
import GoalForm from './GoalForm';
import GoalItem from './GoalItem';

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
