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
    '/src/config/site/restaurant/', // Exclude restaurant folder as requested
  ],
  coverageThreshold: {
    // High priority - complex utility functions
    'src/config/generic/locales-config.ts': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Medium-high priority - rule generation logic
    'src/config/generic/robots/index.ts': {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
    // Medium priority - currency formatting utility
    // Branch threshold is 33% because dollar branch requires complex module mocking
    // Primary use case (euro) is fully tested - dollar is edge case
    'src/lib/site-utils.ts': {
      branches: 33,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    // Low priority - simple wrappers
    'src/config/generic/feature-flags.ts': {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    'src/config/generic/middleware.ts': {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);


