import { auth } from '@/auth';
import { wait } from '@/lib/utils';
import { Button } from '@nextui-org/button';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  await wait(5000);

  return <Link href='/dashboard'>dashboard</Link>;
}

// return (
//   <div className='grid grid-cols-12 gap-6'>
//     {filteredGuilds.map((guild) => (
//       <GuildCard key={guild.id} guild={guild} />
//     ))}
//   </div>
// );
