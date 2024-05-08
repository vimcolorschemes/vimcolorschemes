// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    { source: '/', destination: '/i/trending', permanent: true },
  ],
};

module.exports = nextConfig;
