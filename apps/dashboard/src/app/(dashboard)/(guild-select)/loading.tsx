import { GuildCardSkeleton } from './guild-card';

export default function Loading() {
  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: 3 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        <GuildCardSkeleton key={index} />
      ))}
    </div>
  );
}
