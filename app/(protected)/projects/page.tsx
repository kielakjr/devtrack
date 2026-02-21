import React from "react"
import { getProjects } from "@/lib/projects";
import Project from "@/components/ui/Project";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  )
}
