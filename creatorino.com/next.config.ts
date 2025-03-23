// next.config.js
module.exports = {
  // Use trailing slash to be consistent with server routing
  trailingSlash: true,
  
  // This is required for static exports with Cloudflare Pages
  output: 'export',
  
  // Add this flag to ensure functions directory is included in the build
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  
  // This enables SSG to handle any URL pattern for s/[username]
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    // Skip this during development
    if (dev) return defaultPathMap;

    // Generate a static page for /s route
    return {
      ...defaultPathMap,
      '/s': { page: '/s/[username]' },
    };
  },
  
  // Generate a static site with all features enabled
  images: {
    unoptimized: true,
  },
}