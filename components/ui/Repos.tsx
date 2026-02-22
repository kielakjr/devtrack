'use server';
import { getReposToImport } from "@/lib/github"
import Repo from "./Repo";
import { GitHubRepoBasic } from "@/lib/types/github";

export default async function Repos() {
  const repos = await getReposToImport()

  return (
      repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="space-y-2 flex flex-wrap gap-2">
          {repos.map((repo: GitHubRepoBasic) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </ul>
      )
  )
}
