'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Project as ProjectType, deleteProject } from '@/lib/projects';
import { getRepoDetailed } from '@/lib/github';
import type { GitHubRepoDetailed } from '@/lib/types/github';
import Link from 'next/link';
import { motion } from "motion/react";
import { getLanguageColor } from '@/util/githubColors';

interface ProjectProps {
  project: ProjectType;
  onDelete: () => void;
  index: number;
}

const Project: React.FC<ProjectProps> = ({ project, onDelete, index }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [repoDetails, setRepoDetails] = useState<GitHubRepoDetailed | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletingRef = useRef(false);

  const repoPath = new URL(project.githubRepo).pathname.slice(1);
  const [owner, repoName] = repoPath.split("/");

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const details: GitHubRepoDetailed = await getRepoDetailed(owner, repoName);
        setRepoDetails(details);
      } catch (error) {
        console.error("Error fetching repo details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [project.githubRepo]);

  const handleDelete = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      onDelete();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalBytes = repoDetails?.languages
    ? Object.values(repoDetails.languages).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        layout: { type: "spring", stiffness: 300, damping: 30 },
      }}
      className="border border-border rounded-lg hover:border-primary/30 transition-colors relative group"
    >
      <Link href={`/projects/${repoPath}`} className="block p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {repoDetails && (
              <img
                src={repoDetails.owner.avatar_url}
                alt={repoDetails.owner.login}
                className="size-6 rounded-full"
              />
            )}
            <span className="font-semibold text-primary group-hover:text-primary/80 transition-colors">
              {project.name}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full border border-border text-text/50">
            {repoDetails?.private ? "Private" : "Public"}
          </span>
        </div>

        <p className="text-sm text-text line-clamp-1 mb-3">
          {project.description || "No description provided."}
        </p>

        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-secondary/50 animate-pulse" />
            <span className="text-xs text-text/30">Loading...</span>
          </div>
        ) : repoDetails ? (
          <>
            <div className="flex items-center gap-4 text-xs text-text mb-3">
              {repoDetails.language && (
                <span className="flex items-center gap-1">
                  <span
                    className="size-2.5 rounded-full inline-block"
                    style={{ backgroundColor: getLanguageColor(repoDetails.language) }}
                  />
                  {repoDetails.language}
                </span>
              )}
            </div>

            {repoDetails.languages && totalBytes > 0 && (
              <div className="mb-3">
                <div className="flex h-1.5 rounded-full overflow-hidden">
                  {Object.entries(repoDetails.languages).map(([lang, bytes]) => (
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
              </div>
            )}

            {repoDetails.last_commit && (
              <div className="flex items-center gap-2 text-xs text-text/50">
                {repoDetails.last_commit.author_avatar && (
                  <img
                    src={repoDetails.last_commit.author_avatar}
                    alt={repoDetails.last_commit.author_login}
                    className="size-4 rounded-full"
                  />
                )}
                <span className="truncate max-w-60">
                  {repoDetails.last_commit.message.split("\n")[0]}
                </span>
                <span>·</span>
                <span className="whitespace-nowrap">
                  {formatRelativeDate(repoDetails.last_commit.date)}
                </span>
              </div>
            )}
          </>
        ) : null}
      </Link>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="size-8 text-sm bg-red-500/80 hover:bg-red-500 text-white rounded absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </motion.li>
  );
};

export default Project;

function formatRelativeDate(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}min ago`;

  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(diff / 86_400_000);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
