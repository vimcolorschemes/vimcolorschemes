import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: true,

  async redirects() {
    return [
      { source: '/', destination: '/i/trending', permanent: true },
      { source: '/trending', destination: '/i/trending', permanent: true },
      { source: '/light', destination: '/i/trending/b.light', permanent: true },
      { source: '/dark', destination: '/i/trending/b.dark', permanent: true },

      {
        source: '/light/trending',
        destination: '/i/trending/b.light',
        permanent: true,
      },
      {
        source: '/dark/trending',
        destination: '/i/trending/b.dark',
        permanent: true,
      },

      { source: '/top', destination: '/i/top', permanent: true },
      { source: '/light/top', destination: '/i/top/b.light', permanent: true },
      { source: '/dark/top', destination: '/i/top/b.dark', permanent: true },

      { source: '/new', destination: '/i/new', permanent: true },
      { source: '/light/new', destination: '/i/new/b.light', permanent: true },
      { source: '/dark/new', destination: '/i/new/b.dark', permanent: true },

      { source: '/old', destination: '/i/old', permanent: true },
      { source: '/light/old', destination: '/i/old/b.light', permanent: true },
      { source: '/dark/old', destination: '/i/old/b.dark', permanent: true },

      {
        source: '/recently-updated',
        destination: '/i/trending',
        permanent: true,
      },
      {
        source: '/light/recently-updated',
        destination: '/i/tending/b.light',
        permanent: true,
      },
      {
        source: '/dark/recently-updated',
        destination: '/i/tending/b.dark',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [{ source: '/page/:page', destination: '/i/trending' }];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
