import { getProfileData } from '@/lib/profile';
import ProfileView from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const data = await getProfileData();
  return <ProfileView data={data} />;
}
