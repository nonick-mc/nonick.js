import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: 'https://github.com/nonick-mc/nonick.js',
    nav: {
      title: <Logo height={16} />,
    },
  };
}
