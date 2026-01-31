import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Home from '../page';
import { ThemeProvider } from '@/contexts/ThemeContext';

const en = {
  common: { welcome: 'Welcome' },
  hero: {
    heading: { mainTitle: 'Welcome', subtitle: 'Subtitle' },
    description: 'Welcome description',
    features: {
      freshDaily: 'Fresh daily',
      localIngredients: 'Local ingredients',
      fiveStarRated: 'Five-star rated',
    },
    stickers: { freshDaily: 'Fresh daily', handmade: 'Handmade' },
    badge: {
      closed: 'Closed',
      openNow: 'Open now',
      openingIn: 'Opening in {minutes}{plural}',
      closedOpenToday: 'Open today at {time}',
      closedOpenTomorrow: 'Open tomorrow at {time}',
      currentlyClosed: 'Currently closed',
    },
    cta: { viewMenu: 'View menu', orderNow: 'Order now' },
    stats: {
      yearsExperience: 'Years of experience',
      pizzaVarieties: 'Pizza varieties',
      happyCustomers: 'Happy customers',
    },
  },
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/en',
}));

describe('Localized Home', () => {
  it('renders welcome message in English', () => {
    render(
      <ThemeProvider>
        <NextIntlClientProvider
          messages={en as unknown as Record<string, unknown>}
          locale='en'
        >
          <Home />
        </NextIntlClientProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/welcome/i)).toBeTruthy();
  });
});
