// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    { source: '/', destination: '/trending', permanent: true },
  ],
};

module.exports = nextConfig;
