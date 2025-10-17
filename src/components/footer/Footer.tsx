'use client';

import * as React from 'react';

import { Separator } from '@/components/ui/separator';
import FooterLeft from '@/components/footer/FooterLeft';
import FooterLegal from '@/components/footer/FooterLegal';
import FooterMenu from '@/components/footer/FooterMenu';
import FooterSocial from '@/components/footer/FooterSocial';

type LinkItem = { href: string; label: string };

type FooterProps = {
  currentLocale?: string;
  titles?: { legal: string; social: string; explore: string };
  brandSubtitle?: string;
  rightsReservedText?: string;
  designedByPrefix?: string;
  designedByName?: string;
  legalLabels?: { privacy: string; terms: string; imprint: string };
  menuLabels?: { home: string; menu: string; info: string };
};

export function Footer(props: FooterProps) {
  const {
    currentLocale,
    titles,
    brandSubtitle,
    rightsReservedText,
    designedByPrefix,
    designedByName,
    legalLabels,
    menuLabels,
  } = props;
  const locale = currentLocale ?? 'en';

  const legalTitle = titles?.legal ?? 'Legal';
  const socialTitle = titles?.social ?? 'Social';
  const menuTitle = titles?.explore ?? 'Explore';

  const withLocale = (path: string): string => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  const legalLinks: LinkItem[] = [
    { href: '#', label: legalLabels?.privacy ?? 'Privacy' },
    { href: '#', label: legalLabels?.terms ?? 'Terms' },
    { href: '#', label: legalLabels?.imprint ?? 'Imprint' },
  ];
  const menuLinks: LinkItem[] = [
    { href: withLocale('/'), label: menuLabels?.home ?? 'Home' },
    { href: withLocale('/menu'), label: menuLabels?.menu ?? 'Menu' },
    { href: withLocale('/info'), label: menuLabels?.info ?? 'Info' },
  ];

  return (
    <footer className='w-full border-t border-border bg-gradient-to-b from-background-secondary to-background overflow-x-hidden pb-8 md:pb-0'>
      <div className='mx-auto max-w-7xl px-4 md:px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 py-10'>
          <FooterLeft
            className='flex items-start justify-center md:justify-start text-center md:text-left'
            subtitle={brandSubtitle}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center sm:place-items-start text-center sm:text-left w-full'>
            {/* Social top-left */}
            <FooterSocial
              className='flex flex-col items-center sm:items-start md:justify-center text-center sm:text-left min-w-0 w-full order-1 sm:col-start-1 sm:row-start-1'
              title={socialTitle}
            />
            {/* Explore top-right */}
            <FooterMenu
              className='flex flex-col items-center sm:items-start md:justify-center text-center sm:text-left min-w-0 w-full order-2 sm:col-start-2 sm:row-start-1 lg:col-start-2 lg:row-start-1'
              title={menuTitle}
              links={menuLinks}
            />
            {/* Legal under Explore when two columns */}
            <FooterLegal
              className='flex flex-col items-center sm:items-start md:justify-center text-center sm:text-left min-w-0 w-full order-3 sm:col-start-2 sm:row-start-2 lg:col-start-3 lg:row-start-1'
              title={legalTitle}
              links={legalLinks}
            />
          </div>
        </div>
        <Separator className='my-2' />
        <div className='py-6 text-xs text-foreground-secondary font-secondary space-y-1 text-center md:text-left'>
          <div>
            © {new Date().getFullYear()} {rightsReservedText}
          </div>
          <div>
            <span className='mr-1'>{designedByPrefix}</span>
            <a
              className='underline underline-offset-4 hover:text-primary transition-colors duration-200'
              href='#'
            >
              {designedByName}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
