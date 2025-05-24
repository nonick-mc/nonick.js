import { Icon } from '@/components/icon';
import { Card, type CardProps } from '@heroui/card';
import { cn } from '@heroui/theme';

type StatsCardProps = { label: string; icon: string; value: string } & CardProps;

export async function StatsCard({ label, icon, value, className, ...props }: StatsCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2 p-6', className)} {...props}>
      <div className='flex items-center justify-between select-none text-default-500'>
        <p className='text-sm'>{label}</p>
        <Icon icon={icon} className='text-2xl' />
      </div>
      <p className='text-2xl font-black'>{value}</p>
    </Card>
  );
}
