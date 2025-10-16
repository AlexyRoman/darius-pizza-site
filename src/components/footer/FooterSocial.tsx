import * as React from 'react';
import Link from 'next/link';
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
  const list = items ?? DefaultSocialItems;
  return (
    <div className={className}>
      <h3 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide'>
        {title}
      </h3>
      <div className='grid grid-cols-3 gap-3 place-items-start'>
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

export const DefaultSocialItems: SocialItem[] = [
  {
    href: 'https://maps.app.goo.gl/',
    label: 'Google Maps',
    icon: <SiGooglemaps className='size-5' />,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: <SiInstagram className='size-5' />,
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: <SiFacebook className='size-5' />,
  },
  {
    href: 'https://www.tripadvisor.com',
    label: 'Tripadvisor',
    icon: <SiTripadvisor className='size-5' />,
  },
];

export default FooterSocial;
