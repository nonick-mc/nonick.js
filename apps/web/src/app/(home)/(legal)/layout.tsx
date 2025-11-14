export default function Layout({ children }: LayoutProps<'/'>) {
  return <article className='prose dark:prose-invert max-w-none py-8'>{children}</article>;
}
