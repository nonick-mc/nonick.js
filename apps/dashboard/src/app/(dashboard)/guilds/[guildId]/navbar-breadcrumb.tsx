'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui/components/breadcrumb';
import { useSelectedLayoutSegments } from 'next/navigation';
import { Fragment } from 'react';
import { SidebarNavigationItems } from './sidebar-navigation-items';

export function NavbarBreadcrumb() {
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith('('));

  const getBreadcrumbItems = () => {
    const items: string[] = [];

    for (const group of SidebarNavigationItems) {
      for (const item of group.items) {
        if (item.key && segments[0] === item.key) {
          items.push(group.title);
          items.push(item.title);

          // サブアイテムのチェック
          if (item.subitems && segments[1]) {
            const subitem = item.subitems.find((sub) => sub.key === segments[1]);
            if (subitem) {
              items.push(subitem.title);
            }
          }
          return items;
        }
      }
    }

    // キーがない場合はグループ名のみ追加
    if (segments.length === 0) {
      const firstGroup = SidebarNavigationItems[0];
      items.push(firstGroup?.title ?? '');
      const firstItem = firstGroup?.items[0];
      items.push(firstItem?.title ?? '');
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const itemKey = `${item}-${index}`;
          return (
            <Fragment key={itemKey}>
              {index < breadcrumbItems.length - 1 ? (
                <>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink>{item}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{item}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
