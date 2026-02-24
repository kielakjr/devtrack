'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import type { ProfileData } from '@/lib/profile';
import SessionGraph from '@/components/session/SessionGraph';
import Link from 'next/link';
import Section from '../ui/Section';
import Stat from '../ui/Stat';
import { fmt, relative } from '@/util/dateFormatting';

interface Props {
  data: ProfileData;
}

export default function ProfileView({ data }: Props) {
  const { user, stats, allSessions } = data;
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-5">
        {user.image ? (
          <img src={user.image} alt={user.name ?? ''} className="size-20 rounded-full" />
        ) : (
          <div className="size-20 rounded-full bg-secondary flex items-center justify-center text-2xl text-primary font-bold">
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-primary">{user.name ?? 'User'}</h1>
          <p className="text-sm text-text">{user.email}</p>
          <p className="text-xs text-text/40 mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total time" value={fmt(stats.totalMinutes)} />
        <Stat label="Sessions" value={stats.totalSessions.toString()} />
        <Stat label="Streak" value={`${stats.streak}d ${stats.streak > 0 ? '🔥' : ''}`} />
        <Stat label="Avg session" value={fmt(stats.avgSessionMinutes)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Projects" value={stats.totalProjects.toString()} />
        <Stat label="Courses" value={stats.totalCourses.toString()} />
        <Stat label="Completed" value={stats.completedCourses.toString()} />
        <Stat label="Longest session" value={fmt(stats.longestSession)} />
      </div>

      <Section title="Activity">
        <SessionGraph sessions={allSessions} accountCreatedAt={user.createdAt} />
      </Section>

      <Section title="Quick links">
        <div className="grid grid-cols-3 gap-3">
          <QuickLink href="/dashboard" label="Dashboard" />
          <QuickLink href="/projects" label="Projects" />
          <QuickLink href="/courses" label="Courses" />
        </div>
      </Section>

      <Section title="Account">
        <div className="space-y-2 text-sm">
          <Row label="Email" value={user.email} />
          <Row label="User ID" value={user.id} mono />
          <Row
            label="Last session"
            value={stats.lastSessionAt ? relative(stats.lastSessionAt) : 'No sessions yet'}
          />
          <Row
            label="Account created"
            value={new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          />
        </div>
      </Section>

      <div className="border border-red-500/20 rounded-lg p-4 space-y-4">
        <h2 className="text-xs uppercase tracking-wider text-red-400">Danger zone</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Sign out</p>
            <p className="text-xs text-text/40">Sign out of your account on this device</p>
          </div>
          {confirmLogout ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmLogout(false)}
                className="px-3 py-1.5 text-xs text-text hover:bg-secondary/30 rounded cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1.5 text-xs bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 transition-colors"
              >
                Confirm sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmLogout(true)}
              className="px-3 py-1.5 text-xs border border-red-500/30 text-red-400 rounded cursor-pointer hover:bg-red-500/10 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-text/50">{label}</span>
      <span className={`text-text ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-border rounded-lg p-3 text-center text-sm text-primary hover:border-primary/30 transition-colors"
    >
      {label}
    </Link>
  );
}
