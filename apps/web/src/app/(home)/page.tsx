import { Separator } from '@repo/ui/components/separator';
import { CtaSection } from './_section/cta';
import { FaqSection } from './_section/faq';
import { FeatureSection } from './_section/feature';
import { GallerySection } from './_section/gallery';
import { HeroSection } from './_section/hero';

export default function HomePage() {
  return (
    <main className='overflow-hidden'>
      <HeroSection />
      <Separator />
      <FeatureSection />
      <Separator />
      <GallerySection />
      <Separator />
      <FaqSection />
      <Separator />
      <CtaSection />
    </main>
  );
}
