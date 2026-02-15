'use server';
import { getReposToImport, GitHubRepo } from "@/lib/github"
import Repo from "@/components/ui/Repo";

export default async function ReposPage() {
  const repos = await getReposToImport()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Repos</h1>
      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="space-y-2 flex flex-wrap gap-2">
          {repos.map((repo: GitHubRepo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
        </ul>
      )}
    </div>
  )
}
