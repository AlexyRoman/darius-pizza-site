'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Liquid glass pill - matches portfolio HeaderClock styling.
 * Gradient overlay + radial glow for frosted glass effect.
 */
export function LiquidGlassPill({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        WebkitBackdropFilter: 'saturate(150%) blur(24px)',
        backdropFilter: 'saturate(150%) blur(24px)',
        ...style,
      }}
      className={cn(
        'relative isolate rounded-full border border-border/60',
        'bg-background/25 dark:bg-background/30 supports-[backdrop-filter]:bg-background/25 supports-[backdrop-filter]:dark:bg-background/30',
        'shadow-sm transition-all duration-300',
        'hover:shadow-md hover:border-border hover:bg-background/45 dark:hover:bg-background/50',
        '[--tw-ring-color:var(--color-border)]',
        className
      )}
      data-liquid-glass=''
      {...props}
    >
      {/* Gradient overlay for liquid glass shine */}
      <div
        className='absolute inset-0 rounded-full opacity-60 dark:opacity-40 pointer-events-none'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, transparent 40%, rgba(255, 255, 255, 0.25) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* Inner radial glow for depth */}
      <div
        className='absolute inset-px rounded-full opacity-25 dark:opacity-20 pointer-events-none'
        style={{
          background:
            'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 70%)',
        }}
      />
      <div className='relative z-10 flex items-center gap-1'>{children}</div>
    </div>
  );
}

export default LiquidGlassPill;
