import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    domains: ['ui-avatars.com'],
  },
};

export default nextConfig;
