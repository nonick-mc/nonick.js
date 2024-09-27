import { cn } from '@nextui-org/theme';
import { GuildCardSkeleton } from './guild-card';

export default function Loading() {
  return (
    <div className='grid grid-cols-12 gap-6'>
      {Array(4)
        .fill(null)
        .map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <GuildCardSkeleton className={cn({ 'max-sm:hidden': index > 1 })} key={index} />
        ))}
    </div>
  );
}
