import { redirect } from 'next/navigation';
import { Teams } from './TeamsSetting';
import { getTeamForUser, getUser } from '@/lib/db/queries';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const teamData = await getTeamForUser(user.id);

  if (!teamData) {
    throw new Error('Team not found');
  }

  return <Teams teamData={teamData} />;
}
