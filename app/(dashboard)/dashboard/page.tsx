import { getTasks, getUser } from '@/lib/db/queries';
import { DashboardClient } from '@/components/dashboard-client';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  const tasks = await getTasks(user.id);

  return <DashboardClient initialTasks={tasks} />;
}