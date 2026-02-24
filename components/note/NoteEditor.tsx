'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectNote } from '@/lib/notes';

export default function NoteEditor({
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
