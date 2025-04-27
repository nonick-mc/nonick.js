import { Icon } from '@/components/icon';
import { inviteUrl } from '@/lib/discord/api';
import { Button, type ButtonProps } from '@heroui/button';
import { Link } from '@heroui/link';

export function InviteButton({ ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      as={Link}
      color='primary'
      startContent={<Icon icon='solar:widget-add-bold' className='text-2xl' />}
      href={inviteUrl}
    >
      サーバーを追加
    </Button>
  );
}
