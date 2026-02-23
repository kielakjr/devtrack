'use client';

import React, { useState } from 'react';
import type { GitHubRepoBasic } from '@/lib/types/github';
import { AnimatePresence, motion } from "motion/react";
import Repo from './Repo';

interface ReposProps {
  initialRepos: GitHubRepoBasic[];
}

export default function Repos({ initialRepos }: ReposProps) {
  const [repos, setRepos] = useState(initialRepos);

  const handleAdded = (repoId: number) => {
    setRepos((prev) => prev.filter((r) => r.id !== repoId));
  };

  if (repos.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-text text-sm"
      >
        No repositories found.
      </motion.p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      <AnimatePresence>
        {repos.map((repo, index) => (
          <Repo
            key={repo.id}
            repo={repo}
            index={index}
            onAdded={handleAdded}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
