'use server';
import { getReposToImport, GitHubRepo } from "@/lib/github"
import Repo from "./Repo";

export default async function Repos() {
  const repos = await getReposToImport()

  return (
      repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="space-y-2 flex flex-wrap gap-2">
          {repos.map((repo: GitHubRepo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </ul>
      )
  )
}
