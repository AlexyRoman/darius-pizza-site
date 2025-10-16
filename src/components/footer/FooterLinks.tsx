import * as React from 'react';

import Link from 'next/link';

export type FooterLink = {
  href: string;
  label: string;
};

export type FooterLinksProps = {
  title: string;
  links: FooterLink[];
  className?: string | undefined;
};

export function FooterLinks(props: FooterLinksProps) {
  const { title, links, className } = props;

  return (
    <div className={className}>
      <h3 className='text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide'>
        {title}
      </h3>
      <ul className='space-y-2 w-full max-w-full'>
        {links.map(link => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className='block text-sm font-medium text-foreground/80 hover:text-foreground underline-offset-4 hover:underline break-words text-center sm:text-left'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FooterLinks;
