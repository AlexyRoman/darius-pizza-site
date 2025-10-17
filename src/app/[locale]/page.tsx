'use client';

import HeroSection from '@/components/hero/HeroSection';
import OpeningHoursSection from '@/components/sections/OpeningHoursSection';
import MenuTeaserSection from '@/components/sections/MenuTeaserSection';
import AboutUsSection from '@/components/sections/AboutUsSection';
import ContactBanner from '@/components/sections/ContactBanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <OpeningHoursSection />
      <MenuTeaserSection />
      <AboutUsSection />
      <ContactBanner />
    </>
  );
}
