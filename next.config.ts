import { DiscordEndPoints } from '@/lib/discord/constants';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL(`${DiscordEndPoints.CDN}/**`)],
  },
};

export default nextConfig;
