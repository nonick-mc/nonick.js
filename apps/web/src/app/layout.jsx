import { Noto_Sans_JP } from 'next/font/google';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
});

const banner = <Banner storageKey='some-key'>Nextra 4.0 is released 🎉</Banner>;
const navbar = <Navbar logo={<b>Nextra</b>} />;
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function RootLayout({ children }) {
  return (
    <html lang='en' dir='ltr' suppressHydrationWarning>
      <Head>{/* Your additional tags should be passed as `children` of `<Head>` element */}</Head>
      <body className={`${notoSansJP.className} antialiased`}>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase='https://github.com/shuding/nextra/tree/main/docs'
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
