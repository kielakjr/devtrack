'use client';
import React from 'react'
import { GitHubRepo } from '@/lib/github';
import { addProject } from '@/lib/projects';
import { useState } from 'react';

const Repo: React.FC<{ repo: GitHubRepo }> = ({ repo }) => {
  const [isAdded, setIsAdded] = useState(false);

  if (isAdded) {
    return null;
  }

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
    <li key={repo.id} className="border p-4 rounded w-64 h-24 relative">
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline cursor-pointer">
        {repo.name}
      </a>
      <p className="text-sm text-gray-600">{repo.description}</p>
      <button className="bg-secondary text-white px-2 py-1 rounded text-xs cursor-pointer absolute bottom-2 right-2" onClick={handleAddProject}>{isAdded ? "Added" : "+"}</button>
    </li>
  )
}

export default Repo
