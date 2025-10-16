import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Home from '../page';
import { ThemeProvider } from '@/contexts/ThemeContext';

const en = {
  common: { welcome: 'Welcome' },
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/en',
}));

describe('Localized Home', () => {
  it('renders welcome message in English', () => {
    render(
      <ThemeProvider>
        <NextIntlClientProvider messages={en as unknown as Record<string, unknown>} locale='en'>
          <Home />
        </NextIntlClientProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/welcome/i)).toBeTruthy();
  });
});


