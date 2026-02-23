'use client';

import { useState } from 'react';
import type { CreateCourseInput } from '@/lib/courses';

interface Props {
  initialData?: {
    title: string;
    platform: string | null;
    url: string | null;
    totalHours: number | null;
  };
  onSubmit: (data: CreateCourseInput) => Promise<void>;
  onCancel: () => void;
}

export default function CourseForm({ initialData, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [platform, setPlatform] = useState(initialData?.platform ?? '');
  const [url, setUrl] = useState(initialData?.url ?? '');
  const [totalHours, setTotalHours] = useState(initialData?.totalHours?.toString() ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        platform: platform.trim() || undefined,
        url: url.trim() || undefined,
        totalHours: totalHours ? parseFloat(totalHours) : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-text block mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. React - The Complete Guide"
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-text block mb-1">Platform</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="e.g. Udemy, Coursera, YouTube"
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-text block mb-1">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-text block mb-1">Total hours</label>
          <input
            type="number"
            step="0.5"
            min="0"
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            placeholder="e.g. 40"
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 text-sm text-text hover:bg-secondary/30 rounded cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="px-4 py-1.5 text-sm bg-primary text-background rounded cursor-pointer hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {initialData ? 'Save' : 'Add course'}
        </button>
      </div>
    </form>
  );
}
