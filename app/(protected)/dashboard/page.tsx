import { getDashboardData } from '@/lib/dashboard';
import { getSessionContextOptions } from '@/lib/sessions';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function DashboardPage() {
  const [data, options] = await Promise.all([
    getDashboardData(),
    getSessionContextOptions(),
  ]);

  return <Dashboard data={data} sessionOptions={options} />;
}
