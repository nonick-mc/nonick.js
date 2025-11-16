export default function Layout({ children }: LayoutProps<'/'>) {
  return <article className='prose py-8 max-w-3xl mx-auto'>{children}</article>;
}
