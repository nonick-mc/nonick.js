import { CardContent, CardHeader } from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Logo } from '@/components/logo';

export default function Loading() {
  return (
    <>
      <CardHeader className='gap-6'>
        <Logo height={16} />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-7 w-[120px]' />
          <Skeleton className='h-5 w-[250px]' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-8'>
        <div className='flex flex-col items-center gap-3'>
          <Skeleton className='size-28 rounded-full' />
          <Skeleton className='h-7 w-[150px]' />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <Skeleton className='h-9' />
          <Skeleton className='h-9' />
        </div>
      </CardContent>
    </>
  );
}
