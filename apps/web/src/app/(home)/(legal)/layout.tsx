export default function Layout({ children }: LayoutProps<'/'>) {
  return <article className='prose py-8'>{children}</article>;
}
