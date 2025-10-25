'use client';

import * as React from 'react';
import { Cookie, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import GdprCookieConsent from './gdpr-cookie-consent';
import {
  type CookiePreferences,
  hasConsent,
  getCookiePreferences,
  saveCookieConsent,
} from '@/utils/cookie-utils';
import { enableAnalytics, disableAnalytics } from '@/utils/analytics';

interface CookieConsentBannerProps {
  onAcceptCallback?: (preferences: CookiePreferences) => void;
  onDeclineCallback?: () => void;
  onCustomizeCallback?: (preferences: CookiePreferences) => void;
}

const CookieConsentBanner = React.forwardRef<
  HTMLDivElement,
  CookieConsentBannerProps
>(
  (
    {
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      onCustomizeCallback = () => {},
    },
    ref
  ) => {
    const t = useTranslations('cookieConsent');
    const [isOpen, setIsOpen] = React.useState(false);
    const [hide, setHide] = React.useState(false);
    const [showDetailedModal, setShowDetailedModal] = React.useState(false);

    const handleAcceptAll = React.useCallback(() => {
      const allAccepted = {
        necessary: true,
        analytics: true,
      };
      setIsOpen(false);
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
    }, [onAcceptCallback]);

    const handleDeclineAll = React.useCallback(() => {
      const declined = {
        necessary: true, // Still true as it's required
        analytics: false,
      };
      setIsOpen(false);
      saveCookieConsent('declined', declined);
      
      // Disable analytics
      disableAnalytics();
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged'));
      
      setTimeout(() => {
        setHide(true);
      }, 300);
      onDeclineCallback();
    }, [onDeclineCallback]);

    const handleCustomize = React.useCallback(() => {
      console.log('🔧 BANNER: handleCustomize called');
      console.log('🔧 BANNER: showDetailedModal before:', showDetailedModal);
      setShowDetailedModal(true);
      console.log('🔧 BANNER: setShowDetailedModal(true) called');
    }, [showDetailedModal]);

    const handleDetailedModalClose = React.useCallback(
      (prefs?: CookiePreferences) => {
        console.log(
          '🔧 BANNER: handleDetailedModalClose called with prefs:',
          prefs
        );
        console.log('🔧 BANNER: showDetailedModal before:', showDetailedModal);
        setShowDetailedModal(false);
        console.log('🔧 BANNER: setShowDetailedModal(false) called');

        // If preferences were saved, also close the banner
        if (prefs) {
          setIsOpen(false);
          setTimeout(() => {
            setHide(true);
          }, 300);
          onCustomizeCallback(prefs);
        }
      },
      [showDetailedModal, onCustomizeCallback]
    );

    React.useEffect(() => {
      try {
        // Check if user has already made a choice
        if (hasConsent()) {
          // Try to load saved preferences
          const savedPrefs = getCookiePreferences();
          if (savedPrefs) {
            // Preferences are loaded but not stored in state since they're not used
          }
          // Don't show banner if user has already given consent
          // User can access cookie preferences through footer/settings if needed
          setHide(true);
          return;
        }

        // Show banner after a short delay for better UX
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.warn('Cookie consent error:', error);
      }
    }, []);

    // Don't render anything if hidden or if user already has consent
    if (hide || !isOpen) return null;

    console.log(
      '🔧 BANNER: Rendering banner, showDetailedModal:',
      showDetailedModal
    );

    return (
      <>
        {/* Simple Banner */}
        <div
          ref={ref}
          className={cn(
            'fixed z-50 transition-all duration-700',
            // Bottom positioning with consistent margins on both sides
            'bottom-32 left-4 right-4 sm:bottom-4 sm:right-auto',
            // Animation: slide from bottom on all devices
            'translate-y-0 opacity-100',
            // Responsive width: constrained on mobile, fit content on desktop
            'w-auto max-w-[calc(100vw-2rem)] sm:w-fit sm:min-w-80 sm:max-w-md'
          )}
        >
          <Card className='shadow-lg'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-0 px-4 pt-2'>
              <CardTitle className='text-sm'>{t('title')}</CardTitle>
              <Cookie className='h-3 w-3' />
            </CardHeader>
            <CardContent className='px-4 py-0'>
              <CardDescription className='text-xs'>
                {t('description')}
              </CardDescription>
            </CardContent>
            <CardFooter className='flex flex-col sm:flex-row gap-2 px-4 pb-2 pt-0'>
              <Button
                onClick={handleDeclineAll}
                variant='outline'
                size='sm'
                className='w-full sm:w-auto sm:flex-shrink-0'
              >
                {t('buttons.declineAll')}
              </Button>
              <Button
                onClick={handleCustomize}
                variant='secondary'
                size='sm'
                className='w-full sm:w-auto sm:flex-shrink-0'
              >
                <Settings className='h-3 w-3 mr-1' />
                {t('buttons.customize')}
              </Button>
              <Button
                onClick={handleAcceptAll}
                size='sm'
                className='w-full sm:w-auto sm:flex-shrink-0'
              >
                {t('buttons.acceptAll')}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Detailed Modal - only shown when customize is clicked */}
        {showDetailedModal && (
          <GdprCookieConsent
            open={showDetailedModal}
            onOpenChange={setShowDetailedModal}
            onAcceptCallback={handleDetailedModalClose}
            onDeclineCallback={() => handleDetailedModalClose()}
            onCustomizeCallback={handleDetailedModalClose}
          />
        )}
      </>
    );
  }
);

CookieConsentBanner.displayName = 'CookieConsentBanner';
export { CookieConsentBanner };
export default CookieConsentBanner;
