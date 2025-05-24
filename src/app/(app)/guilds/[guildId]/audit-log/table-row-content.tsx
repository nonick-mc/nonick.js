import { Icon } from '@/components/icon';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { Avatar } from '@heroui/react';
import type { APIUser } from 'discord-api-types/v10';
import { useEffect, useState } from 'react';
import { type AuditLogActionType, type AuditLogTargetName, targetNameTexts } from './constants';

export function TableRowAuthor({ authors, authorId }: { authors: APIUser[]; authorId: string }) {
  const user = authors.find((author) => author.id === authorId);

  return (
    <div className='flex items-center gap-4'>
      <Avatar
        size='sm'
        src={`${DiscordEndPoints.CDN}/avatars/${user?.id}/${user?.avatar}.webp`}
        name={user?.username}
      />
      <p className='text-sm'>{user?.username || 'Unknown User'}</p>
    </div>
  );
}

export function TableRowLogContent({
  actionType,
  targetName,
}: {
  actionType: AuditLogActionType;
  targetName: AuditLogTargetName;
}) {
  let component = <span>不明なアクション</span>;

  switch (actionType) {
    case 'update_guild_setting':
      component = (
        <>
          <Icon icon='solar:settings-outline' className='text-xl text-warning' />
          <p>
            <span className='text-foreground'>{targetNameTexts[targetName]} </span>
            に変更を加えました
          </p>
        </>
      );
      break;
  }

  return <div className='flex gap-3 items-center text-default-500'>{component}</div>;
}

export function TableRowCreatedAt({ time }: { time: Date }) {
  const [formattedTime, setFormattedTime] = useState<string | null>(null);

  useEffect(() => {
    const formatTime = (date: Date) => {
      const yy = date.getFullYear().toString();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yy}/${mm}/${dd} ${hh}:${min}`;
    };

    setFormattedTime(formatTime(time));
  }, [time]);

  return (
    <p className='flex items-center gap-2 text-default-500'>
      <Icon icon='solar:calendar-mark-bold' className='text-xl' />
      <span>{formattedTime}</span>
    </p>
  );
}
