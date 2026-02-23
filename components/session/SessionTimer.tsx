'use client';

import { useState, useEffect } from 'react';
import {
  StudySession,
  startSession,
  stopSession,
  getActiveSession,
  updateSessionContext,
} from '@/lib/sessions';
import { useRouter } from 'next/navigation';

interface ContextOption {
  projects: { id: string; name: string; githubOwner: string; githubName: string }[];
  courses: { id: string; title: string }[];
}

interface Props {
  options: ContextOption;
}

const SESSION_TYPES = [
  { value: 'CODING', label: 'Coding' },
  { value: 'LEARNING', label: 'Learning' },
  { value: 'DEBUGGING', label: 'Debugging' },
  { value: 'REVIEWING', label: 'Reviewing' },
  { value: 'PLANNING', label: 'Planning' },
] as const;

type SessionType = typeof SESSION_TYPES[number]['value'];

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function SessionTimer({ options }: Props) {
  const [active, setActive] = useState<StudySession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [type, setType] = useState<SessionType>('CODING');
  const [contextType, setContextType] = useState<'none' | 'project' | 'course'>('none');
  const [selectedId, setSelectedId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getActiveSession()
      .then(setActive)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    const update = () => {
      setElapsed(Math.floor((Date.now() - new Date(active.startedAt).getTime()) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const handleStart = async () => {
    try {
      const projectId = contextType === 'project' ? selectedId : undefined;
      const courseId = contextType === 'course' ? selectedId : undefined;
      const session = await startSession(type, projectId || undefined, courseId || undefined);
      setActive(session);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStop = async () => {
    if (!active) return;
    try {
      await stopSession(active.id, note || undefined);
      setActive(null);
      setNote('');
      setContextType('none');
      setSelectedId('');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleActiveContextChange = async (value: string) => {
    if (!active) return;

    if (value === 'none') {
      const updated = await updateSessionContext(active.id, { projectId: null, courseId: null });
      setActive(updated);
      return;
    }

    const [type, id] = value.split(':');
    const updated = await updateSessionContext(active.id, {
      projectId: type === 'project' ? id : null,
      courseId: type === 'course' ? id : null,
    });
    setActive(updated);
  };

  const getActiveContextValue = () => {
    if (active?.projectId) return `project:${active.projectId}`;
    if (active?.courseId) return `course:${active.courseId}`;
    return 'none';
  };

  if (loading) {
    return <div className="h-20 animate-pulse bg-secondary/20 rounded-lg" />;
  }

  if (active) {
    return (
      <div className="border border-primary/40 rounded-lg p-4 bg-secondary/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary">
              {active.type.toLowerCase()}
            </span>
            {active.project && (
              <span className="text-xs text-text">
                {active.project.name}
              </span>
            )}
            {active.course && (
              <span className="text-xs text-text">
                {active.course.title}
              </span>
            )}
          </div>
          <span className="text-2xl font-mono font-bold text-primary">
            {formatTime(elapsed)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-text">Assigned to:</label>
          <select
            value={getActiveContextValue()}
            onChange={(e) => handleActiveContextChange(e.target.value)}
            className="px-2 py-1 border border-border rounded text-sm flex-1 bg-background text-text outline-none"
          >
            <option value="none">No context</option>
            {options.projects.length > 0 && (
              <optgroup label="Projects">
                {options.projects.map((p) => (
                  <option key={p.id} value={`project:${p.id}`}>{p.name}</option>
                ))}
              </optgroup>
            )}
            {options.courses.length > 0 && (
              <optgroup label="Courses">
                {options.courses.map((c) => (
                  <option key={c.id} value={`course:${c.id}`}>{c.title}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Session note (optional)..."
            className="flex-1 px-3 py-1.5 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleStop}
            className="px-4 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-sm rounded cursor-pointer transition-colors"
          >
            Stop
          </button>
        </div>
      </div>
    );
  }

  const handleContextSelect = (value: string) => {
    if (value === 'none') {
      setContextType('none');
      setSelectedId('');
      return;
    }
    const [type, id] = value.split(':');
    setContextType(type as 'project' | 'course');
    setSelectedId(id);
  };

  const getStartContextValue = () => {
    if (contextType === 'project' && selectedId) return `project:${selectedId}`;
    if (contextType === 'course' && selectedId) return `course:${selectedId}`;
    return 'none';
  };

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-text block mb-1">Session type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SessionType)}
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text outline-none"
          >
            {SESSION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-text block mb-1">Assign to (optional)</label>
          <select
            value={getStartContextValue()}
            onChange={(e) => handleContextSelect(e.target.value)}
            className="w-full px-3 py-1.5 border border-border rounded text-sm bg-background text-text outline-none"
          >
            <option value="none">No context</option>
            {options.projects.length > 0 && (
              <optgroup label="Projects">
                {options.projects.map((p) => (
                  <option key={p.id} value={`project:${p.id}`}>{p.name}</option>
                ))}
              </optgroup>
            )}
            {options.courses.length > 0 && (
              <optgroup label="Courses">
                {options.courses.map((c) => (
                  <option key={c.id} value={`course:${c.id}`}>{c.title}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleStart}
            className="w-full px-4 py-1.5 bg-primary/80 hover:bg-primary text-background text-sm font-medium rounded cursor-pointer transition-colors"
          >
            Start session
          </button>
        </div>
      </div>
    </div>
  );
}
