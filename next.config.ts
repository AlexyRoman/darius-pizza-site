import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.reflowhq.com',
      },
    ],
  },
  webpack: (config) => {
    return config;
  },
};

export default withNextIntl(nextConfig);
