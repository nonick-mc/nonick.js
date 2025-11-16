export default function Layout({ children }: LayoutProps<'/'>) {
  return <article className='container prose py-8 max-w-4xl'>{children}</article>;
}
