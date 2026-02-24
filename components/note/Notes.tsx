'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ProjectNote,
  createNote,
  updateNote,
  deleteNote,
} from '@/lib/notes';

interface Props {
  projectId: string;
  initialNotes: ProjectNote[];
}

export default function NotesPanel({ projectId, initialNotes }: Props) {
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

function NoteItem({
  note,
  onEdit,
  onDelete,
}: {
  note: ProjectNote;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const wasEdited = new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() > 1000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 rounded-lg border border-border group hover:border-primary/20 transition-colors"
    >
      <p className="text-sm text-text whitespace-pre-wrap">{note.content}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-text/30">
          {new Date(note.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {wasEdited && ' (edited)'}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
      </div>
    </motion.div>
  );
}

function NoteEditor({
  note,
  onSave,
  onCancel,
}: {
  note: ProjectNote;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await onSave(content);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div layout className="border border-primary/30 rounded-lg p-3 space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        rows={3}
        className="w-full px-3 py-2 border border-border rounded text-sm bg-background text-text focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-text hover:bg-secondary/30 rounded cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!content.trim() || saving}
          className="px-3 py-1.5 text-xs bg-primary text-background rounded cursor-pointer hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
}
