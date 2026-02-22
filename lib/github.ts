'use server';

import { auth } from "@/auth";
import { prisma } from "./prisma";
import type {
  GitHubRepoBasic,
  GitHubRepoDetailed,
  GitHubCommitSummary,
  GitHubRepoFull,
  GitHubContributor,
  GitHubBranch,
  GitHubTag,
  GitHubCommitDetail,
  GitHubWeeklyActivity,
} from "./types/github";

async function getToken(): Promise<string> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }
  return session.user.accessToken;
}

async function ghFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getRepos(): Promise<GitHubRepoBasic[]> {
  const token = await getToken();
  return ghFetch<GitHubRepoBasic[]>("/user/repos?per_page=100&sort=updated", token);
}

export async function getReposToImport(): Promise<GitHubRepoBasic[]> {
  const session = await auth();
  if (!session?.user?.accessToken) throw new Error("No access token found");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: { githubRepo: true },
  });
  const existing = new Set(projects.map((p) => p.githubRepo));

  const repos = await getRepos();
  return repos.filter((repo) => !existing.has(repo.html_url));
}

export async function getRepoDetailed(
  owner: string,
  repo: string
): Promise<GitHubRepoDetailed> {
  const token = await getToken();

  const [repoData, languages, commits] = await Promise.all([
    ghFetch<GitHubRepoDetailed>(`/repos/${owner}/${repo}`, token),
    ghFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`, token),
    ghFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=1`, token),
  ]);

  repoData.languages = languages;

  if (commits.length > 0) {
    const c = commits[0];
    repoData.last_commit = {
      sha: c.sha,
      message: c.commit.message,
      author_login: c.author?.login ?? c.commit.author.name,
      author_avatar: c.author?.avatar_url ?? "",
      date: c.commit.author.date,
      html_url: c.html_url,
    } satisfies GitHubCommitSummary;
  }

  return repoData;
}

export async function getRepoFull(
  owner: string,
  repo: string
): Promise<GitHubRepoFull> {
  const token = await getToken();

  const detailed = await getRepoDetailed(owner, repo);

  const [branches, tags, contributors, commits, activity] = await Promise.all([
    ghFetch<any[]>(`/repos/${owner}/${repo}/branches`, token),
    ghFetch<any[]>(`/repos/${owner}/${repo}/tags`, token),
    ghFetch<any[]>(`/repos/${owner}/${repo}/contributors`, token),
    ghFetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=30`, token),
    ghFetch<any[]>(`/repos/${owner}/${repo}/stats/commit_activity`, token).catch(() => []),
  ]);

  return {
    ...detailed,

    // Te pola przyjdą z GET /repos/:owner/:repo (już w detailed)
    git_url: (detailed as any).git_url,
    ssh_url: (detailed as any).ssh_url,
    clone_url: (detailed as any).clone_url,
    permissions: (detailed as any).permissions,

    contributors: contributors.map(
      (c): GitHubContributor => ({
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions,
      })
    ),

    branches: branches.map(
      (b): GitHubBranch => ({
        name: b.name,
        protected: b.protected,
        commit_sha: b.commit.sha,
      })
    ),

    tags: tags.map(
      (t): GitHubTag => ({
        name: t.name,
        commit_sha: t.commit.sha,
      })
    ),

    recent_commits: commits.map(
      (c): GitHubCommitDetail => ({
        sha: c.sha,
        message: c.commit.message,
        author_login: c.author?.login ?? c.commit.author.name,
        author_avatar: c.author?.avatar_url ?? "",
        date: c.commit.author.date,
        html_url: c.html_url,
        parents: c.parents.map((p: any) => p.sha),
        stats: c.stats,
      })
    ),

    commit_activity: (activity as any[]).map(
      (w): GitHubWeeklyActivity => ({
        week: w.week,
        total: w.total,
        days: w.days,
      })
    ),
  };
}
