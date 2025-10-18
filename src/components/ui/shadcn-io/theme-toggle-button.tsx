'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AnimationVariant = 'circle' | 'circle-blur' | 'gif' | 'polygon';
type StartPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface ThemeToggleButtonProps {
  theme?: 'light' | 'dark';
  themeMode?: 'light' | 'dark' | 'system';
  showLabel?: boolean;
  variant?: AnimationVariant;
  start?: StartPosition;
  url?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ThemeToggleButton = ({
  theme = 'light',
  themeMode,
  showLabel = false,
  variant = 'circle',
  start = 'center',
  url,
  className,
  onClick,
  disabled,
}: ThemeToggleButtonProps) => {
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const handleClick = useCallback(() => {
    if (isTransitioningRef.current) return;
    const styleId = `theme-transition-${Date.now()}`;
    const style = document.createElement('style');
    style.id = styleId;

    let css = '';
    const positions: Record<StartPosition, string> = {
      center: 'center',
      'top-left': 'top left',
      'top-right': 'top right',
      'bottom-left': 'bottom left',
      'bottom-right': 'bottom right',
    };

    if (variant === 'circle' || variant === 'circle-blur') {
      const cx =
        start === 'center' ? '50' : start.includes('left') ? '0' : '100';
      const cy =
        start === 'center' ? '50' : start.includes('top') ? '0' : '100';
      if (variant === 'circle') {
        css = `@supports (view-transition-name: root){::view-transition-old(root){animation:none;}::view-transition-new(root){animation:circle-expand .4s ease-out;transform-origin:${positions[start]};}@keyframes circle-expand{from{clip-path:circle(0% at ${cx}% ${cy}%);}to{clip-path:circle(150% at ${cx}% ${cy}%);}}}`;
      } else {
        css = `@supports (view-transition-name: root){::view-transition-old(root){animation:none;}::view-transition-new(root){animation:circle-blur-expand .5s ease-out;transform-origin:${positions[start]};filter:blur(0);}@keyframes circle-blur-expand{from{clip-path:circle(0% at ${cx}% ${cy}%);filter:blur(4px);}to{clip-path:circle(150% at ${cx}% ${cy}%);filter:blur(0);}}}`;
      }
    } else if (variant === 'gif' && url) {
      css = `@supports (view-transition-name: root){::view-transition-old(root){animation:fade-out .4s ease-out;}::view-transition-new(root){animation:gif-reveal 2.5s cubic-bezier(.4,0,.2,1);mask-image:url('${url}');mask-size:0%;mask-repeat:no-repeat;mask-position:center;}@keyframes fade-out{to{opacity:0;}}@keyframes gif-reveal{0%{mask-size:0%;}20%{mask-size:35%;}60%{mask-size:35%;}100%{mask-size:300%;}}}`;
    } else if (variant === 'polygon') {
      css = `@supports (view-transition-name: root){::view-transition-old(root){animation:none;}::view-transition-new(root){animation:${theme === 'light' ? 'wipe-in-dark' : 'wipe-in-light'} .4s ease-out;}@keyframes wipe-in-dark{from{clip-path:polygon(0 0,0 0,0 100%,0 100%);}to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);}}@keyframes wipe-in-light{from{clip-path:polygon(100% 0,100% 0,100% 100%,100% 100%);}to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%);}}}`;
    }

    if (css) {
      style.textContent = css;
      document.head.appendChild(style);
      setTimeout(() => {
        const styleEl = document.getElementById(styleId);
        if (styleEl) styleEl.remove();
      }, 3000);
    }

    type ViewTransition = { finished: Promise<void> };
    const docWithVT = document as Document & {
      startViewTransition?: (callback: () => void) => ViewTransition;
    };
    if (typeof docWithVT.startViewTransition === 'function') {
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      const vt = docWithVT.startViewTransition(() => {
        onClick?.();
      });
      // When the transition finishes, clear the lock
      vt?.finished.finally(() => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      });
    } else {
      onClick?.();
    }
  }, [onClick, variant, start, url, theme]);

  return (
    <Button
      variant='outline'
      size={showLabel ? 'default' : 'icon'}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all',
        showLabel && 'gap-2',
        className
      )}
      aria-label={`Switch theme (current: ${themeMode || theme})`}
      disabled={disabled || isTransitioning}
    >
      {themeMode === 'system' ? (
        <Monitor className='h-[1.2rem] w-[1.2rem]' />
      ) : theme === 'light' ? (
        <Sun className='h-[1.2rem] w-[1.2rem]' />
      ) : (
        <Moon className='h-[1.2rem] w-[1.2rem]' />
      )}
      {showLabel && (
        <span className='text-sm'>
          {themeMode === 'system'
            ? 'System'
            : theme === 'light'
              ? 'Light'
              : 'Dark'}
        </span>
      )}
    </Button>
  );
};

export const useThemeTransition = () => {
  const startTransition = useCallback((updateFn: () => void) => {
    const docWithVT = document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };
    if (typeof docWithVT.startViewTransition === 'function') {
      docWithVT.startViewTransition(updateFn);
    } else {
      updateFn();
    }
  }, []);
  return { startTransition };
};
