/**
 * Tests for metadata generation functions
 */

// Mock locale files
jest.mock(
  '@/locales/en.json',
  () => ({
    __esModule: true,
    default: {
      seo: {
        siteName: 'Darius Pizza',
        title: 'Darius Pizza - Default Title',
        description: 'Default description',
        imageAlt: 'Default image alt',
        keywords: 'pizza, italian',
        home: {
          title: 'Home Title',
          description: 'Home description',
        },
        menu: {
          title: 'Menu Title',
          description: 'Menu description',
        },
        info: {
          title: 'Info Title',
          description: 'Info description',
        },
      },
    },
  }),
  { virtual: true }
);

jest.mock(
  '@/locales/fr.json',
  () => ({
    __esModule: true,
    default: {
      seo: {
        siteName: 'Darius Pizza',
        title: 'Darius Pizza - Titre par défaut',
        description: 'Description par défaut',
        imageAlt: 'Image alt par défaut',
        keywords: 'pizza, italien',
        home: {
          title: 'Titre Accueil',
          description: 'Description accueil',
        },
      },
    },
  }),
  { virtual: true }
);

// Mock configs
jest.mock('@/config/generic/locales-config', () => ({
  getEnabledLocaleCodes: jest.fn(() => ['en', 'fr', 'de', 'it', 'es', 'nl']),
  getDefaultLocale: jest.fn(() => 'fr'),
}));

jest.mock('@/config/site/pages', () => ({
  PAGES: {
    home: { path: '/' },
    menu: { path: '/menu' },
    info: { path: '/info' },
    privacy: { path: '/privacy' },
    cookies: { path: '/cookies' },
    legalMentions: { path: '/legal-mentions' },
  },
}));

jest.mock('@/config/site/metadata', () => ({
  siteMetadataConfig: {
    category: 'Restaurant',
    classification: 'Food & Dining',
  },
}));

const originalEnv = process.env;

describe('metadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.dariuspizza.fr';
    process.env.GOOGLE_SITE_VERIFICATION = 'google123';
    process.env.TWITTER_SITE = '@dariuspizza';
    process.env.TWITTER_CREATOR = '@dariuspizza';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('generateLocalizedMetadata', () => {
    it('should generate metadata for English locale', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.title).toBe('Darius Pizza - Default Title');
      expect(metadata.description).toBe('Default description');
      expect(metadata.keywords).toBe('pizza, italian');
    });

    it('should generate metadata for French locale', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'fr',
        path: '/',
      });

      expect(metadata.title).toBe('Darius Pizza - Titre par défaut');
      expect(metadata.description).toBe('Description par défaut');
    });

    it('should use custom title and description when provided', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
        customTitle: 'Custom Title',
        customDescription: 'Custom Description',
      });

      expect(metadata.title).toBe('Custom Title');
      expect(metadata.description).toBe('Custom Description');
    });

    it('should normalize path correctly', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');

      const metadata1 = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      const metadata2 = await generateLocalizedMetadata({
        locale: 'en',
        path: '',
      });

      // Both should generate same URLs
      expect(metadata1.openGraph?.url).toBe(metadata2.openGraph?.url);
    });

    it('should generate correct canonical URL', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/menu',
      });

      expect(metadata.alternates?.canonical).toBe(
        'https://www.dariuspizza.fr/en/menu'
      );
    });

    it('should generate hreflang links', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/menu',
      });

      expect(metadata.alternates?.languages).toBeDefined();
      expect(metadata.alternates?.languages?.['x-default']).toBe(
        'https://www.dariuspizza.fr/fr/menu'
      );
      expect(metadata.alternates?.languages?.['en']).toBe(
        'https://www.dariuspizza.fr/en/menu'
      );
      expect(metadata.alternates?.languages?.['fr']).toBe(
        'https://www.dariuspizza.fr/fr/menu'
      );
    });

    it('should generate Open Graph metadata', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.openGraph).toBeDefined();
      // Type checking for OpenGraph - structure is validated
      expect((metadata.openGraph as { type?: string })?.type).toBe('website');
      expect(metadata.openGraph?.locale).toBe('en');
      expect(metadata.openGraph?.siteName).toBe('Darius Pizza');
      expect(metadata.openGraph?.title).toBe('Darius Pizza - Default Title');
      expect(metadata.openGraph?.description).toBe('Default description');
      expect(metadata.openGraph?.images).toHaveLength(2);
    });

    it('should generate Twitter metadata', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.twitter).toBeDefined();
      // Type checking for Twitter - structure is validated
      expect((metadata.twitter as { card?: string })?.card).toBe(
        'summary_large_image'
      );
      expect(metadata.twitter?.title).toBe('Darius Pizza - Default Title');
      expect(metadata.twitter?.description).toBe('Default description');
    });

    it('should generate verification tags', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.verification?.google).toBe('google123');
    });

    it('should use default site URL when NEXT_PUBLIC_SITE_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;

      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.metadataBase?.toString()).toBe(
        'https://www.dariuspizza.fr/'
      );
    });

    it('should generate other meta tags', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.other).toBeDefined();
      expect(metadata.other?.robots).toBe('index, follow');
      expect(metadata.other?.['whatsapp:title']).toBe(
        'Darius Pizza - Default Title'
      );
    });

    it('should use default path when not provided', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
      });

      expect(metadata.openGraph?.url).toBe('https://www.dariuspizza.fr/en');
    });

    it('should handle missing seo data gracefully', async () => {
      jest.doMock(
        '@/locales/en.json',
        () => ({
          __esModule: true,
          default: {
            // No seo data
          },
        }),
        { virtual: true }
      );

      jest.resetModules();
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.title).toBe('Darius Pizza'); // Should use fallback
      expect(metadata.description).toBe(''); // Should use fallback
    });

    it('should use fallback title when seoData.title is missing', async () => {
      jest.doMock(
        '@/locales/en.json',
        () => ({
          __esModule: true,
          default: {
            seo: {
              // No title field
              description: 'Some description',
            },
          },
        }),
        { virtual: true }
      );

      jest.resetModules();
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.title).toBe('Darius Pizza');
    });

    it('should use fallback description when seoData.description is missing', async () => {
      jest.doMock(
        '@/locales/en.json',
        () => ({
          __esModule: true,
          default: {
            seo: {
              title: 'Some title',
              // No description field
            },
          },
        }),
        { virtual: true }
      );

      jest.resetModules();
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.description).toBe('');

      // Clean up doMock
      jest.dontMock('@/locales/en.json');
    });

    it('should use fallback Twitter site when env var is not set', async () => {
      delete process.env.TWITTER_SITE;
      delete process.env.TWITTER_CREATOR;

      jest.resetModules();
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.twitter?.site).toBe('@dariuspizza');
      expect(metadata.twitter?.creator).toBe('@dariuspizza');
    });

    it('should handle missing verification env vars', async () => {
      delete process.env.GOOGLE_SITE_VERIFICATION;
      delete process.env.YANDEX_VERIFICATION;
      delete process.env.YAHOO_VERIFICATION;

      jest.resetModules();
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/',
      });

      expect(metadata.verification?.google).toBeUndefined();
      expect(metadata.verification?.yandex).toBeUndefined();
      expect(metadata.verification?.yahoo).toBeUndefined();
    });

    it('should handle trailing slash in path', async () => {
      const { generateLocalizedMetadata } = await import('../metadata');
      const metadata = await generateLocalizedMetadata({
        locale: 'en',
        path: '/menu/',
      });

      // Note: Code only normalizes '/' to '', but doesn't remove trailing slashes from other paths
      expect(metadata.openGraph?.url).toBe(
        'https://www.dariuspizza.fr/en/menu/'
      );
    });
  });

  describe('generatePageMetadata', () => {
    beforeEach(() => {
      // Clear any doMock effects by unmocking and resetting
      jest.unmock('@/locales/en.json');
      jest.resetModules();
      // Restore original env vars
      process.env.NEXT_PUBLIC_SITE_URL = 'https://www.dariuspizza.fr';
      process.env.TWITTER_SITE = '@dariuspizza';
      process.env.TWITTER_CREATOR = '@dariuspizza';
    });

    it('should use custom title and description when provided', async () => {
      const { generatePageMetadata } = await import('../metadata');
      const metadata = await generatePageMetadata(
        'en',
        'home',
        'Custom Title',
        'Custom Description'
      );

      expect(metadata.title).toBe('Custom Title');
      expect(metadata.description).toBe('Custom Description');
    });

    it('should fallback to default SEO data when page-specific data is missing', async () => {
      jest.doMock(
        '@/locales/en.json',
        () => ({
          __esModule: true,
          default: {
            seo: {
              siteName: 'Darius Pizza',
              title: 'Default Title',
              description: 'Default description',
            },
          },
        }),
        { virtual: true }
      );

      jest.resetModules();
      const { generatePageMetadata } = await import('../metadata');
      const metadata = await generatePageMetadata('en', 'privacy');

      expect(metadata.title).toBe('Default Title');
      expect(metadata.description).toBe('Default description');
    });

    it('should use correct path for each page type', async () => {
      const { generatePageMetadata } = await import('../metadata');

      const homeMetadata = await generatePageMetadata('en', 'home');
      const menuMetadata = await generatePageMetadata('en', 'menu');
      const infoMetadata = await generatePageMetadata('en', 'info');

      expect(homeMetadata.openGraph?.url).toContain('/en');
      expect(menuMetadata.openGraph?.url).toContain('/en/menu');
      expect(infoMetadata.openGraph?.url).toContain('/en/info');
    });
  });

  describe('generateViewport', () => {
    it('should generate viewport configuration', async () => {
      const { generateViewport } = await import('../metadata');
      const viewport = generateViewport();

      expect(viewport.colorScheme).toBe('light dark');
      expect(viewport.themeColor).toBe('#191512');
    });
  });
});
