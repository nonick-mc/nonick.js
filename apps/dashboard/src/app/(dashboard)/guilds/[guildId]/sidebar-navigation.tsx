'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@repo/ui/components/sidebar';
import { ChevronRightIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import { SidebarNavigationItems } from './sidebar-navigation-items';

export function SidebarNavigation() {
  const params = useParams<{ guildId: string }>();
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith('('));

  return (
    <>
      {SidebarNavigationItems.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subitems?.length ? (
                    <Collapsible
                      defaultOpen={segments[0] === item.key}
                      className='group/collapsible'
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className='text-muted-foreground' />
                          {item.title}
                          <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subitems.map((subitem) => (
                            <SidebarMenuSubItem key={subitem.key}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={segments[0] === item.key && segments[1] === subitem.key}
                              >
                                <Link href={`${item.url(params.guildId)}/${subitem.key}` as Route}>
                                  {subitem.title}
                                </Link>
                              </SidebarMenuSubButton>
                              {subitem.badge && (
                                <SidebarMenuBadge>{subitem.badge}</SidebarMenuBadge>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <>
                      <SidebarMenuButton asChild isActive={segments[0] === item.key}>
                        <Link href={item.url(params.guildId) as Route}>
                          <item.icon className='text-muted-foreground' />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
