import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
};

// Enable analyzer when ANALYZE is true
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(config);