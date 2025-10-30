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
import socialConfig from '@/config/site/social.json';

type SocialItem = { href: string; label: string; icon?: React.ReactNode };
type SocialConfigItem = {
  key: 'googleMaps' | 'instagram' | 'facebook' | 'tripadvisor';
  href: string;
};

type FooterSocialProps = {
  title: string;
  items?: SocialItem[];
  className?: string;
};

export function FooterSocial(props: FooterSocialProps) {
  const { title, items, className } = props;
  const tSocial = useTranslations('footer.social');

  const iconByKey: Record<SocialConfigItem['key'], React.ReactNode> = {
    googleMaps: <SiGooglemaps className='size-5' />,
    instagram: <SiInstagram className='size-5' />,
    facebook: <SiFacebook className='size-5' />,
    tripadvisor: <SiTripadvisor className='size-5' />,
  };

  const defaultSocialItems: SocialItem[] = (
    socialConfig as SocialConfigItem[]
  ).map(item => ({
    href: item.href,
    label: tSocial(item.key),
    icon: iconByKey[item.key],
  }));

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
