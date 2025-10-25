'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { getCookiePreferences } from '@/utils/cookie-utils';
import { enableAnalytics, disableAnalytics } from '@/utils/analytics';

interface GoogleTagManagerProps {
  gtmId: string;
  gaId: string;
}

export default function GoogleTagManager({
  gtmId,
  gaId,
}: GoogleTagManagerProps) {
  // Listen for cookie changes
  useEffect(() => {
    const checkPreferences = () => {
      const newPreferences = getCookiePreferences();
      
      if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
        console.log('🔍 GTM Component - Cookie preferences updated:', newPreferences);
        console.log('🔍 GTM Component - GTM ID:', gtmId);
        console.log('🔍 GTM Component - GA ID:', gaId);
      }
      
      // Use Consent Mode to update analytics permissions
      if (newPreferences?.analytics && gaId && gaId !== 'G-XXXXXXXXXX') {
        enableAnalytics(gaId);
      } else {
        disableAnalytics();
      }
    };

    // Check immediately
    checkPreferences();

    // Listen for custom cookie change events
    window.addEventListener('cookieConsentChanged', checkPreferences);
    
    // Also check periodically in case events don't fire
    const interval = setInterval(checkPreferences, 1000);

    return () => {
      window.removeEventListener('cookieConsentChanged', checkPreferences);
      clearInterval(interval);
    };
  }, [gaId, gtmId]);

  // Don't load GTM if no ID provided or if it's the placeholder
  if (!gtmId || gtmId === 'GTM-XXXXXXX') {
    if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
      console.log('🔍 GTM not loaded - Invalid GTM ID:', gtmId);
    }
    return null;
  }

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id='gtm-script'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />

      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height='0'
          width='0'
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
