'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ProjectNote } from '@/lib/notes';

export default function NoteItem({
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

