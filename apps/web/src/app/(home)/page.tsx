import { FaqSection } from './_section/faq';
import { HeroSection } from './_section/hero';

export default function HomePage() {
  return (
    <main className='overflow-hidden'>
        <HeroSection />
      <Separator />
        <FaqSection />
      
    </main>
  );
}
