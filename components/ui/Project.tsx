'use client';
import React, {useState, useEffect} from 'react'
import { Project as ProjectType, deleteProject } from '@/lib/projects';
import { getRepoDetailed } from '@/lib/github';
import type { GitHubRepoDetailed } from '@/lib/types/github';

interface ProjectProps {
  project: ProjectType;
  onDelete: () => void;
}

const Project: React.FC<ProjectProps> = ({ project, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoDetails, setRepoDetails] = useState<GitHubRepoDetailed | null>(null);

  console.log("Details for project", project.name, ":", repoDetails);

  const repoPath = new URL(project.githubRepo).pathname.slice(1);
  const [owner, repoName] = repoPath.split("/");

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const details: GitHubRepoDetailed = await getRepoDetailed(owner, repoName);
        setRepoDetails(details);
      } catch (error) {
        console.error("Error fetching repo details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [project.githubRepo]);

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onDelete();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    isLoading ? (
      <p>Loading...</p>
    ) : (
      <li key={project.id} className="w-full h-32 border p-4 rounded relative">
        <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline cursor-pointer">
          {project.name}
        </a>
        <p className="text-sm text-gray-600">{repoDetails?.description || project.description}</p>
        <p className="text-sm text-gray-500 mt-1">Last commit: {repoDetails?.last_commit?.date ? new Date(repoDetails.last_commit.date).toLocaleDateString() : "N/A"}</p>
        <p className="text-sm text-gray-500">Languages: {repoDetails ? Object.keys(repoDetails.languages).join(", ") : "N/A"}</p>
        <button onClick={handleDelete} className="mt-2 size-12 text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded absolute bottom-2 right-2 cursor-pointer">
          -
        </button>
      </li>
    ))}

export default Project
