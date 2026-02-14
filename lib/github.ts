'use server';
import { auth } from "@/auth";

interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  private: boolean;
}

export const getGitHubRepos = async (): Promise<GitHubRepo[]> => {
  const session = await auth();

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch("https://api.github.com/user/repos", {
    headers: { Authorization: `Bearer ${session.user.accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.statusText}`);
  }

  return res.json();
};
