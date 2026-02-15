'use client';
import React from 'react'
import { GitHubRepo } from '@/lib/github';
import { addProject } from '@/lib/projects';

const Repo: React.FC<{ repo: GitHubRepo }> = ({ repo }) => {
  return (
    <li key={repo.id} className="border p-4 rounded w-64 h-24">
      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline cursor-pointer">
        {repo.name}
      </a>
      <p className="text-sm text-gray-600">{repo.description}</p>
      <button className="bg-secondary text-white px-2 py-1 rounded text-xs cursor-pointer relative bottom-0" onClick={() => addProject(repo)}>+</button>
    </li>
  )
}

export default Repo
