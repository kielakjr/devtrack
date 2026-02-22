'use client';

import React, { useState } from 'react';
import type { GitHubRepoBasic } from '@/lib/types/github';
import { addProject } from '@/lib/projects';

const Repo: React.FC<{ repo: GitHubRepoBasic }> = ({ repo }) => {
  const [isAdded, setIsAdded] = useState(false);

  if (isAdded) return null;

  const handleAddProject = async () => {
    if (isAdded) return;
    try {
      await addProject(repo);
      setIsAdded(true);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <li className="border rounded-lg p-4 w-64 h-28 relative group hover:border-blue-400 transition-colors">
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
          className="font-semibold text-sm hover:underline cursor-pointer truncate"
        >
          {repo.name}
        </a>
        <span className="ml-auto text-[10px] text-gray-400">
          {repo.private ? "🔒" : "🌐"}
        </span>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2">
        {repo.description || "No description provided."}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex gap-1 mt-1 overflow-hidden">
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full">
              {t}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleAddProject}
        className="size-8 bg-green-500 hover:bg-green-600 text-white rounded text-sm cursor-pointer absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        +
      </button>
    </li>
  );
};

export default Repo;
