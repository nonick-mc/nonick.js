export default function Layout({ children }: LayoutProps<'/'>) {
  return <article className='container prose py-32 max-w-4xl'>{children}</article>;
}
