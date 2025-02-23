import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  reactStrictMode: true,
  output: 'export',  // Changed from 'standalone' to 'export' for static site generation
  compress: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Optional: Configure trailing slashes if needed
  trailingSlash: true,
};

// Enable analyzer when ANALYZE is true
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(config);