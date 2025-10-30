'use client';

import Image from 'next/image';
import React from 'react';
import ReactCountryFlag from 'react-country-flag';

export function codeToCountry(code: string): string {
  switch (code) {
    case 'en':
      return 'EN-CUSTOM';
    case 'fr':
      return 'FR';
    case 'nl':
      return 'NL';
    default:
      return code.toUpperCase();
  }
}

export function getLanguageName(code: string): string {
  switch (code.toLowerCase()) {
    case 'en':
    case 'en-custom':
      return 'English';
    case 'fr':
      return 'Français';
    case 'de':
      return 'Deutsch';
    case 'it':
      return 'Italiano';
    case 'es':
      return 'Español';
    case 'nl':
      return 'Nederlands';
    default:
      return code.toUpperCase();
  }
}

export function FlagIcon({ code, size = 20 }: { code: string; size?: number }) {
  const languageName = getLanguageName(code);

  if (code === 'EN-CUSTOM') {
    return (
      <Image
        src={'/flags/en.svg'}
        width={size}
        height={Math.round((size * 3) / 4)}
        alt={languageName}
        className='block rounded-full overflow-hidden'
        priority={false}
      />
    );
  }
  return (
    <ReactCountryFlag
      svg
      countryCode={code}
      title={languageName}
      aria-label={languageName}
      style={{
        width: size,
        height: Math.round((size * 3) / 4),
        borderRadius: 999,
      }}
    />
  );
}

export default FlagIcon;
