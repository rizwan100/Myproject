// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',  // Optional: if you're using this config
};

export default nextConfig;  // Correct export
