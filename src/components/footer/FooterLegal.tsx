import * as React from 'react';
import { FooterLinks } from './FooterLinks';

type LegalLink = { href: string; label: string };

type FooterLegalProps = {
  title: string;
  links: LegalLink[];
  className?: string;
};

export function FooterLegal(props: FooterLegalProps) {
  const { title, links, className } = props;
  return <FooterLinks className={className} title={title} links={links} />;
}

export default FooterLegal;
