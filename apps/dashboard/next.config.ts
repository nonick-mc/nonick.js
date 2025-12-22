import type { NextConfig } from 'next';
import { DiscordEndPoints } from '@/lib/discord/constants';

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
    browserDebugInfoInTerminal: true,
  },
  typedRoutes: true,
  images: {
    remotePatterns: [new URL(`${DiscordEndPoints.CDN}/**`)],
  },
  transpilePackages: ['@repo/ui'],
};

export default nextConfig;
