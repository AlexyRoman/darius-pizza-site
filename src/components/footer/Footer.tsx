import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className='border-t mt-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <span className='inline-block h-5 w-5 rounded bg-foreground/70'></span>
            <span>© {new Date().getFullYear()} Alexy Roman</span>
          </div>
          <nav className='flex items-center gap-4'>
            <a href='#' className='hover:underline'>
              {t('legal.privacy', { fallback: 'Privacy' })}
            </a>
            <a href='#' className='hover:underline'>
              {t('legal.terms', { fallback: 'Terms' })}
            </a>
            <a href='#' className='hover:underline'>
              {t('legal.imprint', { fallback: 'Imprint' })}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
