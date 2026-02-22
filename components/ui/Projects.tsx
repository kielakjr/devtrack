'use client';
import React from 'react'
import Project from './Project'
import { Project as ProjectType } from '@/lib/projects';

interface ProjectsProps {
  projects: ProjectType[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [projectsList, setProjectsList] = React.useState<ProjectType[]>(projects);

  return (
    projectsList.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-2">
          {projectsList.sort((a, b) => a.name.localeCompare(b.name)).map((project) => (
            <Project key={project.id} project={project} onDelete={() => setProjectsList(projectsList.filter(p => p.id !== project.id))} />
          ))}
        </ul>
      )
  )
}

export default Projects
