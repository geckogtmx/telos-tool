import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['pdf.js-extract', 'canvas'],
};

export default nextConfig;
