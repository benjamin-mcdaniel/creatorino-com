import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const config: NextConfig = {
  reactStrictMode: true,
  output: 'export',  // This is crucial - it will create an 'out' directory
  compress: true,
  images: {
    unoptimized: true,
  }
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})(config);