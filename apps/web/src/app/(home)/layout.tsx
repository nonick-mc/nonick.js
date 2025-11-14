import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className='container max-w-6xl'>
      <HomeLayout
        {...baseOptions()}
        style={{ '--spacing-fd-container': 'var(--container-6xl)' } as object}
      >
        {children}
      </HomeLayout>
    </div>
  );
}
