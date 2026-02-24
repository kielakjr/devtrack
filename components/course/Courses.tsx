'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Course,
  createCourse,
  updateCourse,
  deleteCourse,
  UpdateCourseInput
} from '@/lib/courses';
import CourseCard from './CourseCard';
import CourseForm from './CourseForm';
import Stat from '../ui/Stat';

interface Props {
  initialCourses: Course[];
}

const STATUS_TABS = [
  { value: 'ALL', label: 'All' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DROPPED', label: 'Dropped' },
] as const;

export default function Courses({ initialCourses }: Props) {
  const [courses, setCourses] = useState(initialCourses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<string>('ALL');

  const filtered = tab === 'ALL'
    ? courses
    : courses.filter((c) => c.status === tab);

  const stats = {
    total: courses.length,
    inProgress: courses.filter((c) => c.status === 'IN_PROGRESS').length,
    completed: courses.filter((c) => c.status === 'COMPLETED').length,
    totalHours: Math.round(
      courses.reduce((sum, c) => sum + c.totalMinutes, 0) / 6
    ) / 10,
  };

  const handleCreate = async (data: {
    title: string;
    platform?: string;
    url?: string;
    totalHours?: number;
  }) => {
    const course = await createCourse(data);
    setCourses((prev) => [course, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (
    courseId: string,
    data: Parameters<typeof updateCourse>[1]
  ) => {
    const updated = await updateCourse(courseId, data);
    setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    setEditingId(null);
  };

  const handleDelete = async (courseId: string) => {
    await deleteCourse(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total" value={stats.total.toString()} />
        <Stat label="In progress" value={stats.inProgress.toString()} />
        <Stat label="Completed" value={stats.completed.toString()} />
        <Stat label="Time spent" value={`${stats.totalHours}h`} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`px-3 py-1.5 text-xs rounded cursor-pointer transition-colors ${
                tab === t.value
                  ? 'bg-primary text-background'
                  : 'text-text hover:bg-secondary/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="px-4 py-1.5 text-sm bg-primary text-background rounded cursor-pointer hover:bg-primary/80 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add course'}
        </button>
      </div>

      {showForm && (
        <CourseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {filtered.length > 0 ? (
        <ul className="space-y-3">
          <AnimatePresence>
            {filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                index={i}
                isEditing={editingId === course.id}
                onEdit={() => setEditingId(editingId === course.id ? null : course.id)}
                onUpdate={(data: UpdateCourseInput) => handleUpdate(course.id, data)}
                onDelete={() => handleDelete(course.id)}
              />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="text-sm text-text/40 text-center py-8">
          {tab === 'ALL' ? 'No courses yet' : `No ${tab.toLowerCase().replace('_', ' ')} courses`}
        </p>
      )}
    </div>
  );
}
