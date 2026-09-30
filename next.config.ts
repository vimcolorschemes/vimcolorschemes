import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Cloudflare needs both: workerd-resolved @libsql/client + traced
  // isomorphic-ws browser builds. Either missing breaks the worker only.
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/@libsql/isomorphic-ws/package.json',
      './node_modules/@libsql/isomorphic-ws/web.mjs',
      './node_modules/@libsql/isomorphic-ws/web.cjs',
    ],
  },
  serverExternalPackages: ['@libsql/client'],
  async headers() {
    return [
      {
        source: '/search/repositories.json',
        headers: [
          {
            key: 'Cache-Control',
            value:
              'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ];
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
