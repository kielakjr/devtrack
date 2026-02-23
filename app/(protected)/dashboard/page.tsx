import { getAllSessions } from '@/lib/sessions';
import { getAccountCreatedAt } from '@/lib/auth';
import SessionGraph from '@/components/session/SessionGraph';

export default async function DashboardPage() {
  const [allSessions, accountCreatedAt] = await Promise.all([
    getAllSessions(),
    getAccountCreatedAt(),
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 overflow-visible">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <SessionGraph sessions={allSessions} accountCreatedAt={accountCreatedAt} />
    </div>
  );
}
