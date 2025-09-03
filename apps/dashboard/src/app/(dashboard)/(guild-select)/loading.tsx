import { GuildCardSkeleton } from './guild-card';

export default function Loading() {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array(3)
        .fill(null)
        .map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: for loading skeleton
          <GuildCardSkeleton key={index} />
        ))}
    </div>
  );
}
