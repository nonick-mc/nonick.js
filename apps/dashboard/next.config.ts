import type { NextConfig } from 'next';
import { DiscordEndPoints } from '@/lib/discord/constants';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [new URL(`${DiscordEndPoints.CDN}/**`)],
  },
  typedRoutes: true,
};

export default nextConfig;
