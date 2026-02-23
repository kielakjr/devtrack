'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Course } from '@/lib/courses';
import type { CreateCourseInput, UpdateCourseInput } from '@/lib/courses';
import CourseForm from './CourseForm';

interface Props {
  course: Course;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: UpdateCourseInput) => Promise<void>;
  onDelete: () => void;
}

const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DROPPED', label: 'Dropped' },
] as const;

export default function CourseCard({
  course,
  index,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
}: Props) {
  const [progress, setProgress] = useState(course.progress);
  const [confirming, setConfirming] = useState(false);

  const timeSpent = formatDuration(course.totalMinutes);
  const progressPercent = Math.round(course.progress);

  const handleProgressCommit = async () => {
    if (progress !== course.progress) {
      await onUpdate({ progress });
    }
  };

  const handleStatusChange = async (status: string) => {
    const newProgress = status === 'COMPLETED' ? 100 : status === 'NOT_STARTED' ? 0 : undefined;
    await onUpdate({
      status: status as any,
      progress: newProgress,
    });
    if (newProgress !== undefined) setProgress(newProgress);
  };

  if (isEditing) {
    return (
      <motion.li layout className="list-none">
        <CourseForm
          initialData={course}
          onSubmit={async (data: UpdateCourseInput) => {
            await onUpdate(data);
          }}
          onCancel={onEdit}
        />
      </motion.li>
    );
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="border border-border rounded-lg p-4 group hover:border-primary/30 transition-colors list-none"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-medium text-primary truncate">
              {course.url ? (
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {course.title}
                </a>
              ) : (
                course.title
              )}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs text-text">
            {course.platform && <span>{course.platform}</span>}
            {course.totalHours && <span>{course.totalHours}h course</span>}
            {course.totalMinutes > 0 && <span>{timeSpent} spent</span>}
            <span>{course._count.sessions} sessions</span>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="px-2 py-1 text-xs text-text hover:bg-secondary/30 rounded cursor-pointer transition-colors"
          >
            Edit
          </button>
          {confirming ? (
            <button
              onClick={() => { onDelete(); setConfirming(false); }}
              className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/20 rounded cursor-pointer transition-colors"
            >
              Confirm
            </button>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              onBlur={() => setConfirming(false)}
              className="px-2 py-1 text-xs text-text hover:bg-red-500/20 hover:text-red-400 rounded cursor-pointer transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-text/50">{progressPercent}%</span>
            {course.totalHours && course.totalMinutes > 0 && (
              <span className="text-[11px] text-text/50">
                {formatDuration(course.totalMinutes)} / {course.totalHours}h
              </span>
            )}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            onMouseUp={handleProgressCommit}
            onTouchEnd={handleProgressCommit}
            className="w-full h-2 rounded-full appearance-none bg-secondary/30 cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:size-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary"
          />
        </div>

        <select
          value={course.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-2 py-1 text-xs border border-border rounded bg-background text-text cursor-pointer"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </motion.li>
  );
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
