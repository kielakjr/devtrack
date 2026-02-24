'use client';

import type { GitHubRepoFull } from '@/lib/types/github';
import CommitActivitySection from '../github/CommitActivitySection';
import { getLanguageColor } from '@/util/githubColors';
import { motion } from "motion/react";
import Section from '../ui/Section';
import Badge from '../ui/Badge';
import Goals from '../goal/Goals';
import Notes from '../note/Notes';
import Stat from '../ui/Stat';
import type { ProjectGoal } from '@/lib/goals';
import type { ProjectNote } from '@/lib/notes';

interface Props {
  repo: GitHubRepoFull;
  goals: ProjectGoal[];
  notes: ProjectNote[];
  projectId: string;
}

export default function ProjectFullView({ repo, goals, notes, projectId }: Props) {
  const totalBytes = repo.languages
    ? Object.values(repo.languages).reduce((a, b) => a + b, 0)
    : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert(`Copied: ${text}`))
      .catch(err => console.error("Error copying to clipboard:", err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="size-14 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">{repo.full_name}</h1>
          <p className="text-text">{repo.description || "No description provided"}</p>
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-primary hover:underline"
        >
          Open on GitHub ↗
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Stars" value={repo.stargazers_count} />
        <Stat label="Forks" value={repo.forks_count} />
        <Stat label="Issues" value={repo.open_issues_count} />
        <Stat label="Watchers" value={repo.watchers_count} />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title={`Goals (${goals.length})`} border>
          <Goals projectId={projectId} initialGoals={goals} />
        </Section>

        <Section title={`Notes (${notes.length})`} border>
          <Notes projectId={projectId} initialNotes={notes} />
        </Section>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {repo.language && <Badge>{repo.language}</Badge>}
        {repo.license && <Badge>{repo.license.name}</Badge>}
        <Badge>{repo.private ? "Private" : "Public"}</Badge>
        <Badge>{(repo.size / 1024).toFixed(1)} MB</Badge>
        {repo.archived && <Badge>Archived</Badge>}
      </div>

      {repo.languages && totalBytes > 0 && (
        <Section title="Languages">
          <div className="flex h-3 rounded-full overflow-hidden">
            {Object.entries(repo.languages).map(([lang, bytes]) => (
              <div
                key={lang}
                className="h-full"
                style={{
                  width: `${(bytes / totalBytes) * 100}%`,
                  backgroundColor: getLanguageColor(lang),
                }}
                title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.entries(repo.languages).map(([lang, bytes]) => (
              <span key={lang} className="text-xs text-text flex items-center gap-1">
                <span
                  className="size-2 rounded-full inline-block"
                  style={{ backgroundColor: getLanguageColor(lang) }}
                />
                {lang} {((bytes / totalBytes) * 100).toFixed(1)}%
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Your Permissions">
        <div className="flex flex-wrap gap-2">
          {Object.entries(repo.permissions).map(([perm, has]) => (
            <span
              key={perm}
              className={`px-2 py-1 rounded text-xs border ${
                has
                  ? "border-primary/30 text-primary"
                  : "border-border text-text/30"
              }`}
            >
              {has ? "✓" : "✕"} {perm}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Clone URLs">
        <div className="space-y-1">
          {[
            { label: "HTTPS", url: repo.clone_url },
            { label: "SSH", url: repo.ssh_url },
            { label: "Git", url: repo.git_url },
          ].map(({ label, url }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className="text-xs font-semibold text-text w-12">{label}</span>
              <code
                className="bg-secondary text-primary px-2 py-1 rounded text-xs flex-1 truncate cursor-pointer hover:bg-secondary/70 transition-colors"
                onClick={() => copyToClipboard(url)}
              >
                {url}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {repo.contributors && repo.contributors.length > 0 && (
        <Section title={`Contributors (${repo.contributors.length})`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {repo.contributors.map((c) => (
              <a
                key={c.login}
                href={c.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded hover:bg-secondary/30 transition-colors"
              >
                <img src={c.avatar_url} alt={c.login} className="size-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium text-primary">{c.login}</p>
                  <p className="text-xs text-text">{c.contributions} commits</p>
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {repo.branches && repo.branches.length > 0 && (
        <Section title={`Branches (${repo.branches.length})`}>
          <div className="flex flex-wrap gap-2">
            {repo.branches.map((b) => (
              <span
                key={b.name}
                className="px-2 py-1 border border-border text-text rounded text-xs flex items-center gap-1"
              >
                {b.protected && <span title="Protected">🛡</span>}
                {b.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {repo.tags && repo.tags.length > 0 && (
        <Section title={`Tags (${repo.tags.length})`}>
          <div className="flex flex-wrap gap-2">
            {repo.tags.map((t) => (
              <span
                key={t.name}
                className="px-2 py-1 border border-border text-text rounded text-xs"
              >
                🏷 {t.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {repo.recent_commits && repo.recent_commits.length > 0 && (
        <Section title={`Recent commits (${repo.recent_commits.length})`}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {repo.recent_commits.map((c) => (
              <div key={c.sha} className="flex items-start gap-3 p-2 hover:bg-secondary/20 rounded transition-colors">
                {c.author_avatar && (
                  <img src={c.author_avatar} alt={c.author_login} className="size-6 rounded-full mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <a
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline truncate block"
                  >
                    {c.message.split("\n")[0]}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-text">
                    <span>{c.author_login}</span>
                    <span>·</span>
                    <span>{new Date(c.date).toLocaleDateString("en-US")}</span>
                    <span className="font-mono text-text/50">{c.sha.slice(0, 7)}</span>
                    {c.stats && (
                      <span>
                        <span className="text-green-400">+{c.stats.additions}</span>{" "}
                        <span className="text-red-400">-{c.stats.deletions}</span>
                      </span>
                    )}
                    {c.parents.length > 1 && (
                      <span className="text-primary/60" title="Merge commit">⑂ merge</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
      {repo.commit_activity && (
        <Section title="Commit Activity (last year)">
          <CommitActivitySection
            owner={repo.owner.login}
            repo={repo.name}
            initialActivity={repo.commit_activity}
          />
        </Section>
      )}

      <div className="grid grid-cols-3 gap-4 text-xs text-text border-t border-border pt-4">
        <div>
          <span className="block font-semibold text-primary">Created</span>
          {new Date(repo.created_at).toLocaleDateString("en-US")}
        </div>
        <div>
          <span className="block font-semibold text-primary">Last updated</span>
          {new Date(repo.updated_at).toLocaleDateString("en-US")}
        </div>
        <div>
          <span className="block font-semibold text-primary">Last push</span>
          {new Date(repo.pushed_at).toLocaleDateString("en-US")}
        </div>
      </div>
    </motion.div>
  );
}
