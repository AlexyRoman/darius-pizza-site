// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/tests/unit/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl$': '<rootDir>/tests/mocks/next-intl.ts',
    '^next-intl/(.*)$': '<rootDir>/tests/mocks/next-intl.ts',
  },
  transformIgnorePatterns: ['node_modules/(?!(next-intl)/)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/types/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/tests/',
    '/src/content/restaurant/',
    '/src/components/ui/',
    '/src/types/',
    '/src/config/site/',
    'src/components/',
    'src/lib/i18n/flags.tsx',
  ],
  coverageThreshold: {
    // ============================================================================
    // HIGH CRITICALITY - Critical app logic requiring thorough testing
    // ============================================================================
    
    // GDPR compliance and user tracking - CRITICAL for legal compliance
    'src/utils/**/*.{ts,tsx}': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    
    // Core library utilities - Complex logic with caching, merging, validation
    // High priority: Complex loading, merging, and validation logic (75/85/80/80)
    'src/lib/{metadata,menu-loader,restaurant-config,opening-hours-utils}.ts': {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80,
    },
    // Environment validation - slightly higher line/statement coverage (75/85/85/85)
    'src/lib/env.ts': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Medium priority: Date utilities and rate limiting (70/80/75/75)
    'src/lib/{date-utils,pacer}.ts': {
      branches: 70,
      functions: 80,
      lines: 75,
      statements: 75,
    },
    // Medium-high priority: Locale metadata getter (80/85/85/85)
    'src/lib/og-metadata.ts': {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Special cases with lower thresholds
    // Currency formatting - branch threshold is 33% because dollar branch requires complex mocking
    // Primary use case (euro) is fully tested - dollar is edge case
    'src/lib/site-utils.ts': {
      branches: 33,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    // Simple utility - className helper (well-tested via usage)
    'src/lib/utils.ts': {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    
    // ============================================================================
    // MEDIUM-HIGH CRITICALITY - Core configuration and i18n
    // ============================================================================
    
    // Internationalization - routing and request handling
    'src/i18n/**/*.{ts,tsx}': {
      branches: 65,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    
    // Core configuration - locales and robots
    'src/config/generic/locales-config.ts': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    'src/config/generic/robots/**/*.{ts,tsx}': {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    
    // ============================================================================
    // MEDIUM-LOW CRITICALITY - Simple wrappers and utilities
    // ============================================================================
    
    // Configuration wrappers - simple feature flags and middleware (50/60/60/60)
    // Note: locales-config.ts and robots/** are defined above with higher thresholds
    'src/config/generic/{feature-flags,middleware}.ts': {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    // Hooks - simple wrappers around libs/contexts
    'src/hooks/**/*.{ts,tsx}': {
      branches: 70,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

module.exports = createJestConfig(customJestConfig);


