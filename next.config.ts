import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  
  // Power optimization
  poweredByHeader: false,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.reflowhq.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  webpack: (config, { isServer }) => {
    // Bundle analyzer configuration
    if (process.env.ANALYZE === 'true') {
      const analyzerMode = process.env.BUNDLE_ANALYZE || 'browser';
      const shouldAnalyze = (analyzerMode === 'browser' && !isServer) || (analyzerMode === 'server' && isServer);
      
      if (shouldAnalyze) {
        config.plugins?.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: `report-${analyzerMode}.html`,
            openAnalyzer: false,
          })
        );
      }
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
