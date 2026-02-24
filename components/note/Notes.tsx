'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  ProjectNote,
  createNote,
  updateNote,
  deleteNote,
} from '@/lib/notes';
import NoteEditor from './NoteEditor';
import NoteItem from './NoteItem';

interface Props {
  projectId: string;
  initialNotes: ProjectNote[];
}

export default function Notes({ projectId, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      const note = await createNote(projectId, newContent);
      setNotes((prev) => [note, ...prev]);
      setNewContent('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (noteId: string, content: string) => {
    const updated = await updateNote(noteId, content);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    setEditingId(null);
  };

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a note..."
          rows={2}
          className="flex-1 px-3 py-2 border border-border rounded text-sm bg-background text-text placeholder:text-text/30 focus:outline-none focus:border-primary resize-none"
        />
        <button
          type="submit"
          disabled={!newContent.trim() || submitting}
          className="px-4 self-end py-2 text-xs bg-primary text-background rounded cursor-pointer hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="space-y-2">
        <AnimatePresence>
          {notes.map((note) => (
            editingId === note.id ? (
              <NoteEditor
                key={note.id}
                note={note}
                onSave={(content) => handleUpdate(note.id, content)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <NoteItem
                key={note.id}
                note={note}
                onEdit={() => setEditingId(note.id)}
                onDelete={() => handleDelete(note.id)}
              />
            )
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <p className="text-sm text-text/30 text-center py-4">No notes yet</p>
      )}
    </div>
  );
}
