import { getActiveSession, getRecentSessions, getGlobalStats, getSessionContextOptions } from '@/lib/sessions';
import SessionTimer from '@/components/session/SessionTimer';
import SessionList from '@/components/session/SessionList';

export default async function SessionsPage() {
  const [options, sessions, stats] = await Promise.all([
    getSessionContextOptions(),
    getRecentSessions(),
    getGlobalStats(),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sessions</h1>

      <SessionTimer options={options} />
      <SessionList sessions={sessions} stats={stats} />
    </div>
  );
}
