'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Cog, X } from 'lucide-react';
import ThemeToggle from '@/components/header/ThemeToggle';
import LocaleToggle from '@/components/header/LocaleToggle';
import { withDebounce } from '@/lib/pacer';

const RADIUS = 48; // distance from center (closer to settings)

export function RadialSettings({ currentLocale }: { currentLocale: string }) {
  const [isOpen, _setIsOpen] = React.useState(false);
  const setIsOpen = React.useMemo(() => withDebounce(_setIsOpen, 100), []);

  const items = React.useMemo(
    () => [
      { key: 'theme', angle: -90, node: <ThemeToggle /> },
      {
        key: 'locale',
        angle: -30,
        node: <LocaleToggle currentLocale={currentLocale} />,
      },
    ],
    [currentLocale]
  );

  return (
    <div className='relative'>
      <AnimatePresence>
        {isOpen &&
          items.map((item, index) => {
            const angleInRadians = (item.angle * Math.PI) / 180;
            return (
              <motion.div
                key={item.key}
                className='absolute z-50'
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                animate={{
                  x: RADIUS * Math.cos(angleInRadians),
                  y: RADIUS * Math.sin(angleInRadians),
                  opacity: 1,
                  scale: 1,
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0.7 }}
                transition={{
                  duration: 0.25,
                  ease: 'easeInOut',
                  delay: index * 0.02,
                }}
              >
                <div className='rounded-full border border-white/10 ring-1 ring-border bg-background/40 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40'>
                  {item.node}
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(v => !v)}
        size='icon'
        variant='ghost'
        className='relative z-50 rounded-full border border-white/10 ring-1 ring-border bg-background/40 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40 hover:bg-background/40 active:bg-background/40 focus:bg-background/40 focus-visible:outline-none focus:outline-none focus:ring-0'
        aria-label='Settings'
      >
        {isOpen ? <X className='h-5 w-5' /> : <Cog className='h-5 w-5' />}
      </Button>
    </div>
  );
}

export default RadialSettings;
