import React from 'react';
import { render, screen } from '@testing-library/react';
import { codeToCountry, getLanguageName, FlagIcon } from '@/lib/i18n/flags';

describe('i18n flags helpers', () => {
  it('codeToCountry maps known codes and uppercases unknown', () => {
    expect(codeToCountry('en')).toBe('EN-CUSTOM');
    expect(codeToCountry('fr')).toBe('FR');
    expect(codeToCountry('nl')).toBe('NL');
    expect(codeToCountry('de')).toBe('DE');
    expect(codeToCountry('es')).toBe('ES');
  });

  it('getLanguageName returns human-readable names', () => {
    expect(getLanguageName('en')).toBe('English');
    expect(getLanguageName('en-custom')).toBe('English');
    expect(getLanguageName('fr')).toBe('Français');
    expect(getLanguageName('de')).toBe('Deutsch');
    expect(getLanguageName('it')).toBe('Italiano');
    expect(getLanguageName('es')).toBe('Español');
    expect(getLanguageName('nl')).toBe('Nederlands');
    expect(getLanguageName('zz')).toBe('ZZ');
  });
});

describe('FlagIcon', () => {
  it('renders custom EN svg for EN-CUSTOM', () => {
    render(<FlagIcon code='EN-CUSTOM' size={16} />);
    const img = screen.getByRole('img', { name: /english/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      'src',
      expect.stringContaining('/flags/en.svg')
    );
  });

  it('renders ReactCountryFlag for regular country codes', () => {
    render(<FlagIcon code='FR' size={16} />);
    const node = screen.getByLabelText(/français/i);
    expect(node).toBeInTheDocument();
  });
});
