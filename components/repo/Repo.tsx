'use client';

import React, { useState } from 'react';
import type { GitHubRepoBasic } from '@/lib/types/github';
import { addProject } from '@/lib/projects';
import { motion } from "motion/react";

interface RepoProps {
  repo: GitHubRepoBasic;
  index: number;
  onAdded: (repoId: number) => void;
}

const Repo: React.FC<RepoProps> = ({ repo, index, onAdded }) => {
  const [adding, setAdding] = useState(false);

  const handleAddProject = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addProject(repo);
      onAdded(repo.id);
    } catch (error) {
      console.error("Error adding project:", error);
      setAdding(false);
    }
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.1 } }}
      transition={{
        duration: 0.3,
        delay: index * 0.02,
        layout: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className="border border-border rounded-lg p-4 w-64 h-28 relative group hover:border-primary/30 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="size-5 rounded-full"
        />
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-primary hover:underline cursor-pointer truncate"
        >
          {repo.name}
        </a>
        <span className="ml-auto text-[10px] text-text/50">
          {repo.private ? "🔒" : "🌐"}
        </span>
      </div>

      <p className="text-xs text-text line-clamp-2">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex gap-1 mt-1 overflow-hidden">
          {repo.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] px-1.5 py-0.5 border border-primary/20 text-primary/70 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleAddProject}
        disabled={adding}
        className="size-8 bg-primary hover:bg-primary/80 disabled:bg-primary/30 text-background rounded text-sm cursor-pointer absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        +
      </button>
    </motion.li>
  );
};

export default Repo;
