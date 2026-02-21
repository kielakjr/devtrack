'use client';
import React from 'react'
import { Project as ProjectType, deleteProject } from '@/lib/projects';

interface ProjectProps {
  project: ProjectType;
  onDelete: () => void;
}

const Project: React.FC<ProjectProps> = ({ project, onDelete }) => {

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onDelete();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <li key={project.id} className="border p-4 rounded relative">
      <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline cursor-pointer">
        {project.name}
      </a>
      <p className="text-sm text-gray-600">{project.description}</p>
      <button onClick={handleDelete} className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded absolute bottom-2 right-2 cursor-pointer">
        -
      </button>
    </li>
  )
}

export default Project
