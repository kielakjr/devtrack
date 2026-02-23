import { getDashboardData } from '@/lib/dashboard';
import { getSessionContextOptions, getActiveSession } from '@/lib/sessions';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function DashboardPage() {
  const [data, options, activeSession] = await Promise.all([
    getDashboardData(),
    getSessionContextOptions(),
    getActiveSession(),
  ]);

  return <Dashboard data={data} sessionOptions={options} activeSession={activeSession} />;
}
