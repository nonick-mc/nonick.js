import Link from 'next/link';
import { HeroSection } from './_section/hero';

export default function HomePage() {
  return (
    <main className='overflow-hidden'>
      <section className='relative'>
        <HeroSection />
      </section>
    </main>
  );
}
