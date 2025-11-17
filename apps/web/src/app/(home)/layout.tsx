import { Separator } from '@repo/ui/components/separator';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Footer } from './footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <HomeLayout
        {...baseOptions()}
        style={{ '--spacing-fd-container': 'var(--container-6xl)' } as object}
      >
        {children}
      </HomeLayout>
      <Separator />
      <Footer />
    </>
  );
}
