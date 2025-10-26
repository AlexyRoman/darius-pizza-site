'use client';

import * as React from 'react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import {
  type CookiePreferences,
  hasConsent,
  getCookiePreferences,
  saveCookieConsent,
} from '@/utils/cookie-utils';
import { enableAnalytics, disableAnalytics } from '@/utils/analytics';

interface GdprCookieConsentProps {
  onAcceptCallback?: (preferences: CookiePreferences) => void;
  onDeclineCallback?: () => void;
  onCustomizeCallback?: (preferences: CookiePreferences) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const GdprCookieConsent = React.forwardRef<
  HTMLDivElement,
  GdprCookieConsentProps
>(
  (
    {
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      onCustomizeCallback = () => {},
      open,
      onOpenChange,
    },
    ref
  ) => {
    const t = useTranslations('cookieConsent');
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);
    const [preferences, setPreferences] = React.useState<CookiePreferences>({
      necessary: true, // Always true, can't be disabled
      analytics: false,
    });

    // Use external open state if provided, otherwise use internal state
    const modalOpen = open !== undefined ? open : isOpen;
    const setModalOpen = onOpenChange || setIsOpen;

    const handleAcceptAll = React.useCallback(() => {
      const allAccepted = {
        necessary: true,
        analytics: true,
      };
      setPreferences(allAccepted);
      setModalOpen(false);
      saveCookieConsent('accepted', allAccepted);

      // Enable analytics
      if (process.env.NEXT_PUBLIC_GA_ID) {
        enableAnalytics(process.env.NEXT_PUBLIC_GA_ID);
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged'));

      setTimeout(() => {
        setHide(true);
      }, 300);
      onAcceptCallback(allAccepted);
    }, [onAcceptCallback, setModalOpen]);

    const handleDeclineAll = React.useCallback(() => {
      const declined = {
        necessary: true, // Still true as it's required
        analytics: false,
      };
      setPreferences(declined);
      setModalOpen(false);
      saveCookieConsent('declined', declined);

      // Disable analytics
      disableAnalytics();

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged'));

      setTimeout(() => {
        setHide(true);
      }, 300);
      onDeclineCallback();
    }, [onDeclineCallback, setModalOpen]);

    const handleCloseModal = React.useCallback(() => {
      setModalOpen(false);
      // Don't set any cookies - user just closed without saving
    }, [setModalOpen]);

    const handleSaveCustomPreferences = React.useCallback(() => {
      setModalOpen(false);
      // Only set cookies when user actually saves preferences
      saveCookieConsent('customized', preferences);

      // Enable/disable analytics based on preferences
      if (preferences.analytics && process.env.NEXT_PUBLIC_GA_ID) {
        enableAnalytics(process.env.NEXT_PUBLIC_GA_ID);
      } else {
        disableAnalytics();
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged'));

      setTimeout(() => {
        setHide(true);
      }, 300);
      onCustomizeCallback(preferences);
    }, [preferences, onCustomizeCallback, setModalOpen]);

    const handlePreferenceChange = React.useCallback(
      (key: keyof CookiePreferences, value: boolean) => {
        if (key === 'necessary') return; // Can't change necessary cookies
        setPreferences(prev => ({ ...prev, [key]: value }));
      },
      []
    );

    React.useEffect(() => {
      try {
        // Only auto-show if no external open state is provided
        if (open === undefined) {
          // Check if user has already made a choice
          if (hasConsent()) {
            // Try to load saved preferences
            const savedPrefs = getCookiePreferences();
            if (savedPrefs) {
              setPreferences(savedPrefs);
            }
            // Don't hide - let external component control visibility
            return;
          }

          // Show modal after a short delay for better UX
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.warn('Cookie consent error:', error);
      }
    }, [open]);

    if (hide) return null;

    return (
      <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
        <DialogContent
          ref={ref}
          className='w-[95vw] max-w-md mx-auto max-h-[80vh] sm:max-h-[85vh] overflow-hidden flex flex-col'
          onPointerDownOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
        >
          {/* Header */}
          <DialogHeader className='space-y-3 pb-4'>
            <DialogTitle className='flex items-center gap-2 text-xl font-semibold'>
              <Cookie className='h-5 w-5' />
              {t('title')}
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground leading-relaxed'>
              {t('description')}
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className='flex-1 overflow-y-auto space-y-4'>
            <div className='text-sm text-muted-foreground'>
              {t('customizeIntro')}
            </div>

            <Separator />

            {/* Cookie Categories */}
            <div className='space-y-3'>
              {/* Necessary Cookies */}
              <div className='border rounded-lg p-4 bg-muted/20'>
                <div className='flex items-center justify-between mb-2'>
                  <Label
                    htmlFor='necessary-cookies'
                    className='text-sm font-medium'
                  >
                    {t('cookies.necessary.title')}
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Switch
                      id='necessary-cookies'
                      checked={true}
                      disabled={true}
                    />
                    <span className='text-xs text-muted-foreground'>
                      {t('required')}
                    </span>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {t('cookies.necessary.detailedDescription')}
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className='border rounded-lg p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Label
                    htmlFor='analytics-cookies'
                    className='text-sm font-medium'
                  >
                    {t('cookies.analytics.title')}
                  </Label>
                  <Switch
                    id='analytics-cookies'
                    checked={preferences.analytics}
                    onCheckedChange={checked =>
                      handlePreferenceChange('analytics', checked)
                    }
                  />
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  {t('cookies.analytics.detailedDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className='pt-4 border-t pb-6 sm:pb-4'>
            <div className='flex flex-col gap-2 w-full'>
              <div className='flex gap-2'>
                <Button
                  onClick={handleDeclineAll}
                  variant='outline'
                  size='sm'
                  className='flex-1'
                >
                  {t('buttons.declineAll')}
                </Button>
                <Button onClick={handleAcceptAll} size='sm' className='flex-1'>
                  {t('buttons.acceptAll')}
                </Button>
              </div>
              <Button
                onClick={handleSaveCustomPreferences}
                variant='secondary'
                size='sm'
                className='w-full'
              >
                {t('buttons.savePreferences')}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

GdprCookieConsent.displayName = 'GdprCookieConsent';
export { GdprCookieConsent };
export default GdprCookieConsent;
