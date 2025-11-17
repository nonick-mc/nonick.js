import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withMDX = createMDX();

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  typedRoutes: true,
  images: {
    remotePatterns: [new URL('https://cdn.nonick-js.com/**')],
    unoptimized: true,
  },
  transpilePackages: ['@repo/ui'],
};

export default withMDX(nextConfig);
