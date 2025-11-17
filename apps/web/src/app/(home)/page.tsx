import { Separator } from '@repo/ui/components/separator';
import { FaqSection } from './_section/faq';
import { GallerySection } from './_section/gallery';
import { HeroSection } from './_section/hero';

export default function HomePage() {
  return (
    <main className='overflow-hidden'>
        <HeroSection />
      <Separator />
      <GallerySection />
      <Separator />
        <FaqSection />
      
    </main>
  );
}
