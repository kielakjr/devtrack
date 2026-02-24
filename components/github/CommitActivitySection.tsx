'use client';

import { useState, useEffect } from 'react';
import { getCommitActivity } from '@/lib/github';
import type { GitHubWeeklyActivity } from '@/lib/types/github';
import CommitGraph from './CommitGraph';

interface Props {
  owner: string;
  repo: string;
  initialActivity: GitHubWeeklyActivity[];
}

export default function CommitActivitySection({ owner, repo, initialActivity }: Props) {
  const [activity, setActivity] = useState(initialActivity);
  const [retries, setRetries] = useState(0);

  const hasData = activity.length > 0;
  const maxRetries = 5;

  useEffect(() => {
    if (hasData || retries >= maxRetries) return;

    const timer = setTimeout(async () => {
      try {
        const data = await getCommitActivity(owner, repo);
        if (data.length > 0) {
          setActivity(data);
        } else {
          setRetries((r) => r + 1);
        }
      } catch {
        setRetries((r) => r + 1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasData, retries, owner, repo]);

  if (!hasData && retries >= maxRetries) return null;

  if (!hasData) {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="size-2 rounded-full bg-primary/50 animate-pulse" />
        <span className="text-xs text-text/40">Loading commit activity...</span>
      </div>
    );
  }

  return <CommitGraph activity={activity} />;
}
