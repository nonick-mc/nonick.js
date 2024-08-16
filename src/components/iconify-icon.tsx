'use client';

import { Icon, type IconifyIconProps } from '@iconify-icon/react';

export function IconifyIcon(props: Omit<IconifyIconProps, 'ref'>) {
  return <Icon {...props} />;
}
