'use client';
import React from 'react'
import Project from './Project'
import { Project as ProjectType } from '@/lib/projects';
import { AnimatePresence, motion } from "motion/react";

interface ProjectsProps {
  projects: ProjectType[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [projectsList, setProjectsList] = React.useState<ProjectType[]>(projects);

  return (
    projectsList.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text">No projects found.</motion.p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence>
          {projectsList.sort((a, b) => a.name.localeCompare(b.name)).map((project, index) => (
            <Project key={project.id} project={project} onDelete={() => setProjectsList(projectsList.filter(p => p.id !== project.id))} index={index} />
          ))}
          </AnimatePresence>
        </ul>
      )
  )
}

export default Projects
