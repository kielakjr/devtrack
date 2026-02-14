'use server';
import { getGitHubRepos } from "@/lib/github"

export default async function ReposPage() {
  const repos = await getGitHubRepos()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Repos</h1>
      <p>List of repositories will go here.</p>
      {repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <ul className="space-y-2">
          {repos.map((repo: any) => (
            <li key={repo.id} className="border p-4 rounded">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold">
                {repo.name}
              </a>
              <p className="text-sm text-gray-600">{repo.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
