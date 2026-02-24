'use client';

import { useState } from 'react';
import { ProjectGoal } from '@/lib/goals';

export default function GoalForm({
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
