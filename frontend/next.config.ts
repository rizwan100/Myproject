import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
};

};

export default nextConfig;
