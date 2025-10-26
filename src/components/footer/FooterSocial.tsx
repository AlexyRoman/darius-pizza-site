'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  SiInstagram,
  SiFacebook,
  SiTripadvisor,
  SiGooglemaps,
} from 'react-icons/si';
import { Button } from '@/components/ui/button';

type SocialItem = { href: string; label: string; icon?: React.ReactNode };

type FooterSocialProps = {
  title: string;
  items?: SocialItem[];
  className?: string;
};

export function FooterSocial(props: FooterSocialProps) {
  const { title, items, className } = props;
  const tSocial = useTranslations('footer.social');

  const defaultSocialItems: SocialItem[] = [
    {
      href: 'https://www.google.com/maps/place/Darius+Pizza/@43.1744,6.5282769,16.38z/data=!4m6!3m5!1s0x12cecfc35d6ab941:0x566b87a459a79c32!8m2!3d43.1719212!4d6.5298349!16s%2Fg%2F11j37b_scj?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D',
      label: tSocial('googleMaps'),
      icon: <SiGooglemaps className='size-5' />,
    },
    {
      href: 'https://www.instagram.com/le_darius_cavalaire?igsh=NjdsdzM2amUzOW1m',
      label: tSocial('instagram'),
      icon: <SiInstagram className='size-5' />,
    },
    {
      href: 'https://www.facebook.com/share/174FixgsBD/?mibextid=wwXIfr',
      label: tSocial('facebook'),
      icon: <SiFacebook className='size-5' />,
    },
    {
      href: 'https://www.tripadvisor.fr/Restaurant_Review-g666994-d23745036-Reviews-Darius_Pizza-Cavalaire_Sur_Mer_Var_Provence_Alpes_Cote_d_Azur.html?m=69573',
      label: tSocial('tripadvisor'),
      icon: <SiTripadvisor className='size-5' />,
    },
  ];

  const list = items ?? defaultSocialItems;
  return (
    <div className={className}>
      <h3 className='text-sm font-secondary font-semibold mb-3 text-primary uppercase tracking-wide'>
        {title}
      </h3>
      <div className='grid grid-cols-3 gap-3 place-items-start -ml-2 sm:-ml-2.5'>
        {list.map(item => (
          <Button
            asChild
            variant='ghost'
            size='icon'
            key={item.href}
            aria-label={item.label}
          >
            <Link
              className='text-foreground-secondary hover:text-primary transition-colors duration-200'
              href={item.href}
              aria-label={item.label}
              target='_blank'
              rel='noopener noreferrer'
            >
              {item.icon}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default FooterSocial;
