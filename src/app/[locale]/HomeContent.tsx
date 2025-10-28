'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import hero immediately as it's above the fold
import HeroSection from '@/components/hero/HeroSection';

// Lazy load below-the-fold components
const OpeningHoursSection = dynamic(
  () => import('@/components/sections/OpeningHoursSection'),
  {
    loading: () => <div className='min-h-[400px]' />,
    ssr: true,
  }
);

const MenuTeaserSection = dynamic(
  () => import('@/components/sections/MenuTeaserSection'),
  {
    loading: () => <div className='min-h-[400px]' />,
    ssr: true,
  }
);

const AboutUsSection = dynamic(
  () => import('@/components/sections/AboutUsSection'),
  {
    loading: () => <div className='min-h-[400px]' />,
    ssr: true,
  }
);

const ContactBanner = dynamic(
  () => import('@/components/sections/ContactBanner'),
  {
    loading: () => <div className='min-h-[400px]' />,
    ssr: true,
  }
);

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div className='min-h-[400px]' />}>
        <OpeningHoursSection />
      </Suspense>
      <Suspense fallback={<div className='min-h-[400px]' />}>
        <MenuTeaserSection />
      </Suspense>
      <Suspense fallback={<div className='min-h-[400px]' />}>
        <AboutUsSection />
      </Suspense>
      <Suspense fallback={<div className='min-h-[400px]' />}>
        <ContactBanner />
      </Suspense>
    </>
  );
}
