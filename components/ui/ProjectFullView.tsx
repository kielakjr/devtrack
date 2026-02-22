'use client';

import type { GitHubRepoFull } from '@/lib/types/github';
import CommitGraph from './CommitGraph';
import { getLanguageColor } from '@/util/githubColors';
import { motion } from "motion/react";

interface Props {
  repo: GitHubRepoFull;
}

export default function ProjectFullView({ repo }: Props) {
  const totalBytes = repo.languages
    ? Object.values(repo.languages).reduce((a, b) => a + b, 0)
    : 0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`Copied: ${text}`);
      })
      .catch(err => {
        console.error("Error copying to clipboard:", err);
      });
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
          <h1 className="text-2xl font-bold">{repo.full_name}</h1>
          <p className="text-gray-500">{repo.description || "No description provided"}</p>
        </div>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm text-blue-500 hover:underline"
        >
          Open on GitHub ↗
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Stars" value={repo.stargazers_count} icon="⭐" />
        <Stat label="Forks" value={repo.forks_count} icon="🍴" />
        <Stat label="Issues" value={repo.open_issues_count} icon="🐛" />
        <Stat label="Watchers" value={repo.watchers_count} icon="👁" />
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {repo.language && (
          <Badge color="blue">{repo.language}</Badge>
        )}
        {repo.license && (
          <Badge color="green">{repo.license.name}</Badge>
        )}
        <Badge color="gray">{repo.private ? "🔒 Private" : "🌐 Public"}</Badge>
        <Badge color="gray">{(repo.size / 1024).toFixed(1)} MB</Badge>
        {repo.archived && <Badge color="yellow">📦 Archived</Badge>}
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
              <span key={lang} className="text-xs text-gray-600 flex items-center gap-1">
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
              className={`px-2 py-1 rounded text-xs ${
                has ? "bg-green-100 text-green-800" : "bg-red-50 text-red-400"
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
              <span className="text-xs font-semibold text-gray-500 w-12">{label}</span>
              <code className="bg-primary text-background px-2 py-1 rounded text-xs flex-1 truncate cursor-pointer hover:bg-primary/80 transition-colors" onClick={() => copyToClipboard(url)}>{url}</code>
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
                className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 transition-colors"
              >
                <img src={c.avatar_url} alt={c.login} className="size-8 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{c.login}</p>
                  <p className="text-xs text-gray-500">{c.contributions} commits</p>
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
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs flex items-center gap-1"
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
                className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs"
              >
                🏷 {t.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {repo.recent_commits && repo.recent_commits.length > 0 && (
        <Section title={`Ostatnie commity (${repo.recent_commits.length})`}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {repo.recent_commits.map((c) => (
              <div key={c.sha} className="flex items-start gap-3 p-2 hover:bg-primary/20 rounded">
                {c.author_avatar && (
                  <img src={c.author_avatar} alt={c.author_login} className="size-6 rounded-full mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <a
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-500 truncate block"
                  >
                    {c.message.split("\n")[0]}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{c.author_login}</span>
                    <span>·</span>
                    <span>{new Date(c.date).toLocaleDateString("pl-PL")}</span>
                    <span className="font-mono text-gray-400">{c.sha.slice(0, 7)}</span>
                    {c.stats && (
                      <span>
                        <span className="text-green-600">+{c.stats.additions}</span>{" "}
                        <span className="text-red-600">-{c.stats.deletions}</span>
                      </span>
                    )}
                    {c.parents.length > 1 && (
                      <span className="text-purple-500" title="Merge commit">⑂ merge</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {repo.commit_activity && repo.commit_activity.length > 0 && (
        <Section title="Commit Activity (last year)">
          <CommitGraph activity={repo.commit_activity} />
        </Section>
      )}

      <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 border-t pt-4">
        <div>
          <span className="block font-semibold text-gray-700">Created</span>
          {new Date(repo.created_at).toLocaleDateString("pl-PL")}
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Last updated</span>
          {new Date(repo.updated_at).toLocaleDateString("pl-PL")}
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Last push</span>
          {new Date(repo.pushed_at).toLocaleDateString("pl-PL")}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="border rounded-lg p-3 text-center">
      <span className="text-lg">{icon}</span>
      <p className="text-xl font-bold">{value.toLocaleString()}</p>
      <p className="text-xs text-primary">{label}</p>
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-600",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  );
}
