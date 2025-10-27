import { Card } from '@/components/ui/card';

export default function Layout({ children }: LayoutProps<'/verify/guilds/[guildId]'>) {
  return (
    <div className='min-h-dvh flex items-center justify-center px-6'>
      <Card className='max-w-[400px] w-full gap-8'>{children}</Card>
    </div>
  );
}
