export interface GitHubOwner {
  login: string;
  avatar_url: string;
  id: number;
  html_url: string;
  type: "User" | "Organization";
}

export interface GitHubRepoBasic {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  owner: GitHubOwner;
  topics: string[];
  visibility: "public" | "private" | "internal";
  created_at: string;
  default_branch: string;
}

export interface GitHubRepoDetailed extends GitHubRepoBasic {
  language: string | null;
  languages?: Record<string, number>;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  size: number;

  updated_at: string;
  pushed_at: string;

  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;

  fork: boolean;
  archived: boolean;
  disabled: boolean;
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;

  last_commit?: GitHubCommitSummary;
}

export interface GitHubCommitSummary {
  sha: string;
  message: string;
  author_login: string;
  author_avatar: string;
  date: string;
  html_url: string;
}

export interface GitHubRepoFull extends GitHubRepoDetailed {
  git_url: string;
  ssh_url: string;
  clone_url: string;

  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };

  contributors?: GitHubContributor[];
  branches?: GitHubBranch[];
  tags?: GitHubTag[];
  recent_commits?: GitHubCommitDetail[];
  commit_activity?: GitHubWeeklyActivity[];
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubBranch {
  name: string;
  protected: boolean;
  commit_sha: string;
}

export interface GitHubTag {
  name: string;
  commit_sha: string;
}

export interface GitHubCommitDetail {
  sha: string;
  message: string;
  author_login: string;
  author_avatar: string;
  date: string;
  html_url: string;
  parents: string[];
  stats?: {
    additions: number;
    deletions: number;
    total: number;
  };
}

export interface GitHubWeeklyActivity {
  week: number;
  total: number;
  days: [number, number, number, number, number, number, number];
}
