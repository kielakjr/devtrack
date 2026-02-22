'use server';
import { getReposToImport } from "@/lib/github"
import Repos from "./Repos";

export default async function ReposServer() {
  const repos = await getReposToImport()

  return <Repos initialRepos={repos} />
}
