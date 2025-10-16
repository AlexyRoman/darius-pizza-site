import * as React from 'react';

import { FooterLinks } from './FooterLinks';

type MenuLink = {
  href: string;
  label: string;
};

type FooterMenuProps = {
  title: string;
  links: MenuLink[];
  className?: string;
};

export function FooterMenu(props: FooterMenuProps) {
  const { title, links, className } = props;

  return <FooterLinks className={className} title={title} links={links} />;
}

export default FooterMenu;
