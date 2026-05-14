import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/*': ['./database/**/*.db'],
  },
  async redirects() {
    return [{ source: '/', destination: '/i/trending', permanent: true }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
