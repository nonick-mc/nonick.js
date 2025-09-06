import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatsCardProps = { label: string; icon: LucideIcon; value: string; className?: string };

export async function StatsCard({ label, value, className, ...props }: StatsCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2 p-6', className)}>
      <div className='flex items-center justify-between select-none text-default-500'>
        <p className='text-sm'>{label}</p>
        <props.icon className='size-5' />
      </div>
      <p className='text-2xl font-black'>{value}</p>
    </Card>
  );
}
