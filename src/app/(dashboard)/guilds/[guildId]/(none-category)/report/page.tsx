import { redirect } from 'next/navigation';
import { hasAccessPermission } from '../../middlewares';

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessPermission(guildId))) redirect('/');
  return <p>Page</p>;
}
