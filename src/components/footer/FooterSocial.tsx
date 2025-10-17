"use client";
 
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
      href: 'https://maps.app.goo.gl/',
      label: tSocial('googleMaps'),
      icon: <SiGooglemaps className='size-5' />,
    },
    {
      href: 'https://instagram.com',
      label: tSocial('instagram'),
      icon: <SiInstagram className='size-5' />,
    },
    {
      href: 'https://facebook.com',
      label: tSocial('facebook'),
      icon: <SiFacebook className='size-5' />,
    },
    {
      href: 'https://www.tripadvisor.com',
      label: tSocial('tripadvisor'),
      icon: <SiTripadvisor className='size-5' />,
    },
  ];

  const list = items ?? defaultSocialItems;
  return (
    <div className={className}>
      <h3 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide'>
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
              className='text-foreground/80 hover:text-foreground transition-colors'
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
