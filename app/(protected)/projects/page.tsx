import React, { Suspense } from "react"
import { getProjects } from "@/lib/projects";
import Projects from "@/components/ui/Projects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <Suspense fallback={<p>Loading projects...</p>}>
        <Projects projects={projects} />
      </Suspense>
    </div>
  )
}
