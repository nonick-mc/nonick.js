'use client';

import { Listbox, ListboxItem, ListboxSection } from '@heroui/listbox';
import {
  Accordion,
  AccordionItem,
  type ListboxProps,
  type ListboxSectionProps,
  type Selection,
} from '@heroui/react';
import { cn } from '@heroui/theme';
import { Tooltip } from '@heroui/tooltip';
import type { Params } from 'next/dist/server/request/params';
import { useParams } from 'next/navigation';
import React from 'react';
import { LinkForListbox } from './heroui/listbox-link';
import { Icon } from './icon';

export enum SidebarItemType {
  Nest = 'nest',
}

export type SidebarItem<T extends Params> = {
  key: string;
  title: string;
  icon?: string;
  href?: string | ((arg: T) => string);
  type?: SidebarItemType.Nest;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  items?: SidebarItem<T>[];
  className?: string;
};

export type SidebarProps<T extends Params> = Omit<ListboxProps<SidebarItem<T>>, 'children'> & {
  items: SidebarItem<T>[];
  isCompact?: boolean;
  hideEndContent?: boolean;
  iconClassName?: string;
  sectionClasses?: ListboxSectionProps['classNames'];
  classNames?: ListboxProps['classNames'];
  defaultSelectedKey: string;
  onSelect?: (key: string) => void;
  onItemPress?: () => void;
};

export function SidebarNavigation<TParams extends Params = Params>({
  ref,
  items,
  isCompact,
  defaultSelectedKey,
  onSelect,
  onItemPress,
  hideEndContent,
  sectionClasses: sectionClassesProp = {},
  itemClasses: itemClassesProp = {},
  iconClassName,
  classNames,
  className,
  ...props
}: SidebarProps<TParams>) {
  const params = useParams<TParams>();
  const [selected, setSelected] = React.useState<React.Key>(defaultSelectedKey);

  const sectionClasses = {
    ...sectionClassesProp,
    base: cn(sectionClassesProp?.base, 'w-full', {
      'p-0 max-w-[44px]': isCompact,
    }),
    group: cn(sectionClassesProp?.group, {
      'flex flex-col gap-1': isCompact,
    }),
    heading: cn(sectionClassesProp?.heading, {
      hidden: isCompact,
    }),
  };

  const itemClasses = {
    ...itemClassesProp,
    base: cn(itemClassesProp?.base, {
      'w-11 h-11 gap-0 p-0': isCompact,
    }),
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const renderNestItem = React.useCallback(
    (item: SidebarItem<TParams>) => {
      const isNestType =
        item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

      if (isNestType) {
        // Is a nest type item , so we need to remove the href
        item.href = undefined;
      }

      return (
        <ListboxItem
          {...item}
          as={LinkForListbox}
          key={item.key}
          href={typeof item.href === 'function' ? item.href(params) : item.href}
          onPress={onItemPress}
          classNames={{
            base: cn(
              {
                'h-auto p-0': !isCompact && isNestType,
              },
              {
                'inline-block w-11': isCompact && isNestType,
              },
            ),
          }}
          endContent={isCompact || isNestType || hideEndContent ? null : (item.endContent ?? null)}
          startContent={
            isCompact || isNestType ? null : item.icon ? (
              <Icon
                className={cn(
                  'text-default-500 group-data-[selected=true]:text-foreground text-2xl',
                  iconClassName,
                )}
                icon={item.icon}
              />
            ) : (
              (item.startContent ?? null)
            )
          }
          title={isCompact || isNestType ? null : item.title}
        >
          {isCompact ? (
            <Tooltip content={item.title} placement='right'>
              <div className='flex w-full items-center justify-center'>
                {item.icon ? (
                  <Icon
                    className={cn(
                      'text-default-500 group-data-[selected=true]:text-foreground text-2xl',
                      iconClassName,
                    )}
                    icon={item.icon}
                  />
                ) : (
                  (item.startContent ?? null)
                )}
              </div>
            </Tooltip>
          ) : null}
          {!isCompact && isNestType ? (
            <Accordion className={'p-0'}>
              <AccordionItem
                key={item.key}
                aria-label={item.title}
                classNames={{
                  heading: 'pr-3',
                  trigger: 'p-0',
                  content: 'py-0 pl-4',
                }}
                title={
                  item.icon ? (
                    <div className={'flex h-11 items-center gap-2 px-2 py-1.5'}>
                      <Icon
                        className={cn(
                          'text-default-500 group-data-[selected=true]:text-foreground text-2xl',
                          iconClassName,
                        )}
                        icon={item.icon}
                      />
                      <span className='text-small font-medium text-default-500 group-data-[selected=true]:text-foreground'>
                        {item.title}
                      </span>
                    </div>
                  ) : (
                    (item.startContent ?? null)
                  )
                }
              >
                {item.items && item.items?.length > 0 ? (
                  <Listbox
                    className={'mt-0.5'}
                    classNames={{
                      list: cn('border-l border-default-200 pl-4'),
                    }}
                    items={item.items}
                    variant='flat'
                  >
                    {item.items.map(renderItem)}
                  </Listbox>
                ) : (
                  renderItem(item)
                )}
              </AccordionItem>
            </Accordion>
          ) : null}
        </ListboxItem>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCompact, hideEndContent, iconClassName, items],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const renderItem = React.useCallback(
    (item: SidebarItem<TParams>) => {
      const isNestType =
        item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest;

      if (isNestType) {
        return renderNestItem(item);
      }

      return (
        <ListboxItem
          {...item}
          as={LinkForListbox}
          key={item.key}
          href={typeof item.href === 'function' ? item.href(params) : item.href}
          onPress={onItemPress}
          endContent={isCompact || hideEndContent ? null : (item.endContent ?? null)}
          startContent={
            isCompact ? null : item.icon ? (
              <Icon
                className={cn(
                  'text-default-500 group-data-[selected=true]:text-foreground text-2xl',
                  iconClassName,
                )}
                icon={item.icon}
              />
            ) : (
              (item.startContent ?? null)
            )
          }
          textValue={item.title}
          title={isCompact ? null : item.title}
        >
          {isCompact ? (
            <Tooltip content={item.title} placement='right'>
              <div className='flex w-full items-center justify-center'>
                {item.icon ? (
                  <Icon
                    className={cn(
                      'text-default-500 group-data-[selected=true]:text-foreground text-2xl',
                      iconClassName,
                    )}
                    icon={item.icon}
                  />
                ) : (
                  (item.startContent ?? null)
                )}
              </div>
            </Tooltip>
          ) : null}
        </ListboxItem>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCompact, hideEndContent, iconClassName, itemClasses?.base],
  );

  return (
    <Listbox
      key={isCompact ? 'compact' : 'default'}
      ref={ref}
      hideSelectedIcon
      as='nav'
      className={cn('list-none', className)}
      classNames={{
        ...classNames,
        list: cn('items-center', classNames?.list),
      }}
      color='default'
      itemClasses={{
        ...itemClasses,
        base: cn(
          'px-3 min-h-11 rounded-large h-[44px] data-[selected=true]:bg-default-100',
          itemClasses?.base,
        ),
        title: cn(
          'text-small font-medium text-default-500 group-data-[selected=true]:text-foreground',
          itemClasses?.title,
        ),
      }}
      items={items}
      selectedKeys={[selected] as unknown as Selection}
      selectionMode='single'
      variant='flat'
      aria-label='Navigation Listbox'
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0];

        setSelected(key as React.Key);

        onSelect?.(key as string);
      }}
      {...props}
    >
      {(item) => {
        return item.items && item.items?.length > 0 && item?.type === SidebarItemType.Nest ? (
          renderNestItem(item)
        ) : item.items && item.items?.length > 0 ? (
          <ListboxSection
            key={item.key}
            classNames={{
              ...sectionClasses,
              group: cn('space-y-0.5', sectionClasses.group),
            }}
            showDivider={isCompact}
            title={item.title}
          >
            {item.items.map(renderItem)}
          </ListboxSection>
        ) : (
          renderItem(item)
        );
      }}
    </Listbox>
  );
}
