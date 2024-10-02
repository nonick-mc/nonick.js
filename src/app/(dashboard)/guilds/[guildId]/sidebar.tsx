'use client';

import { IconifyIcon } from '@/components/iconify-icon';
import { Logo } from '@/components/logo';
import DashboardConfig from '@/config/dashboard';
import { Discord } from '@/lib/constants';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { Modal, ModalContent, useDisclosure } from '@nextui-org/modal';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { cn } from '@nextui-org/theme';
import type { APIGuild } from 'discord-api-types/v10';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { createContext, useContext } from 'react';

type SidebarContextType = {
  guild: APIGuild;
  onClose?: () => void;
};

const SidebarContext = createContext<SidebarContextType>({ guild: {} as APIGuild });

export function Sidebar({ className, ...props }: SidebarContextType & { className?: string }) {
  return (
    <SidebarContext.Provider value={props}>
      <BaseSidebar className={className} />
    </SidebarContext.Provider>
  );
}

export function SidebarModal({ ...props }: SidebarContextType) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} isIconOnly disableRipple className='lg:hidden' variant='flat'>
        <IconifyIcon icon='basil:menu-outline' className='text-[22px]' />
      </Button>
      <Modal
        classNames={{ wrapper: 'justify-start', base: 'sm:m-0' }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: { duration: 0.3 },
            },
            exit: {
              x: '-200%',
              transition: { duration: 0.4 },
            },
          },
        }}
      >
        <ModalContent className='w-auto h-dvh rounded-l-none m-0 px-3 gap-3'>
          {(onClose) => (
            <SidebarContext.Provider value={{ ...props, onClose }}>
              <div className='h-16 px-1 flex items-center justify-start'>
                <Logo height={18} />
              </div>
              <BaseSidebar className='flex-1' />
            </SidebarContext.Provider>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export function BaseSidebar({ className }: { className?: string }) {
  return (
    <ScrollShadow
      className={cn('w-[280px] flex flex-col gap-3', className)}
      hideScrollBar
      isEnabled
    >
      <SidebarGuild />
      <SidebarNavigation />
    </ScrollShadow>
  );
}

export function SidebarGuild() {
  const { guild, onClose } = useContext(SidebarContext);
  const icon = guild.icon
    ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp`
    : undefined;

  return (
    <Button
      as={Link}
      href='/'
      onClick={onClose}
      className='flex flex-shrink-0 mx-1 h-14 font-semibold justify-between'
      variant='bordered'
      endContent={<IconifyIcon icon='solar:sort-horizontal-bold' className='text-[20px]' />}
    >
      <div className='flex items-center gap-2 overflow-hidden'>
        <Avatar
          className='flex-shrink-0'
          size='sm'
          name={guild.name}
          src={icon}
          alt={`${guild.name}のサーバーアイコン`}
          showFallback
        />
        <p className='flex-1 truncate'>{guild.name}</p>
      </div>
    </Button>
  );
}

export function SidebarNavigation() {
  const config = DashboardConfig.navigation;
  const { guildId } = useParams<{ guildId: string }>();
  const { onClose } = useContext(SidebarContext);
  const currentSegment = useSelectedLayoutSegments().filter((v) => !v.startsWith('('))[0];

  return (
    <Listbox
      items={config}
      variant='flat'
      aria-label='ナビゲーションメニュー'
      disallowEmptySelection
      selectionMode='single'
      defaultSelectedKeys={[currentSegment ?? 'none-segment']}
      disabledKeys={config.flatMap((v) =>
        v.items.filter((v) => v.isDisabled).map((v) => v.segment ?? 'none-segment'),
      )}
      hideSelectedIcon
    >
      {(item) => (
        <ListboxSection
          key={item.key}
          classNames={{ heading: 'text-sm' }}
          items={item.items}
          title={item.label}
          showDivider={config[config.length - 1] !== item}
        >
          {(item) => {
            return (
              <ListboxItem
                onClick={onClose}
                key={item.segment ?? 'none-segment'}
                href={`/guilds/${guildId}/${item.segment ?? ''}`}
                className='px-3 py-2 mb-1 data-[selected=true]:bg-default/40'
                startContent={<IconifyIcon icon={item.icon} className='text-[20px]' />}
                endContent={item.chipLabel && <Chip size='sm'>{item.chipLabel}</Chip>}
              >
                {item.label}
              </ListboxItem>
            );
          }}
        </ListboxSection>
      )}
    </Listbox>
  );
}
