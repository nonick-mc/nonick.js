import type { NextConfig } from 'next';
import { DiscordEndPoints } from '@/lib/discord/constants';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    typedEnv: true,
    browserDebugInfoInTerminal: true,
  },
  typedRoutes: true,
  images: {
    remotePatterns: [new URL(`${DiscordEndPoints.CDN}/**`)],
  },
};

export default nextConfig;
