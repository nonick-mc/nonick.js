'use client';

import { Avatar, cn } from '@heroui/react';
import type React from 'react';
import { Icon } from '../icon';

// TODO: メッセージ編集フォームの共通化

type AuthorWrapperProps = {
  name: string;
  avatar: string;
  isBot: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
};

export function AuthorWrapper({ name, avatar, isBot, isDisabled, children }: AuthorWrapperProps) {
  return (
    <div className='flex gap-3 items-start'>
      <Avatar src={avatar} className='flex-shrink-0' isDisabled={isDisabled} />
      <div className={cn('flex-1 flex flex-col gap-2', { 'opacity-disabled': isDisabled })}>
        <div className='flex gap-2 items-center'>
          <p className='font-semibold'>{name}</p>
          {isBot && <BotBadge />}
        </div>
        {children}
      </div>
    </div>
  );
}

function BotBadge() {
  return (
    <div className='flex-shrink-0 flex items-center gap-1 rounded-md bg-[#5865f2] px-1 py-0.5'>
      <Icon icon='ic:baseline-check' />
      <span className='text-xs font-bold'>アプリ</span>
    </div>
  );
}
