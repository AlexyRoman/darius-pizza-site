'use client';

import { useEffect, useState } from 'react';
import { getCookiePreferences } from '@/utils/cookie-utils';

export default function AnalyticsDebug() {
  const [preferences, setPreferences] = useState<ReturnType<typeof getCookiePreferences>>(null);
  const [cookies, setCookies] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateDebug = () => {
      if (typeof window === 'undefined') return;
      setPreferences(getCookiePreferences());
      setCookies(document.cookie);
    };

    // Update immediately
    updateDebug();

    // Listen for cookie changes
    window.addEventListener('cookieConsentChanged', updateDebug);
    
    // Update periodically
    const interval = setInterval(updateDebug, 1000);

    return () => {
      window.removeEventListener('cookieConsentChanged', updateDebug);
      clearInterval(interval);
    };
  }, []);

  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG !== 'true' || !mounted) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <h4>🔍 Analytics Debug</h4>
      <div><strong>Preferences:</strong> {JSON.stringify(preferences)}</div>
      <div><strong>GA ID:</strong> {process.env.NEXT_PUBLIC_GA_ID}</div>
      <div><strong>GTM ID:</strong> {process.env.NEXT_PUBLIC_GTM_ID}</div>
      <div><strong>dataLayer:</strong> {typeof window !== 'undefined' ? (window.dataLayer?.length || 0) : 0} events</div>
      <div><strong>gtag:</strong> {typeof window !== 'undefined' ? typeof window.gtag : 'undefined'}</div>
      <div><strong>Cookies:</strong></div>
      <div style={{ fontSize: '10px', wordBreak: 'break-all' }}>
        {cookies.split(';').map((cookie, i) => (
          <div key={i}>{cookie.trim()}</div>
        ))}
      </div>
    </div>
  );
}
