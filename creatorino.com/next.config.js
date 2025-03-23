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

    // Add a catch-all route for s/* that serves the username.js page
    return {
      ...defaultPathMap,
      '/s/[username]': { page: '/s/[username]' },
    };
  },
  
  // Generate a static site with all features enabled
  images: {
    unoptimized: true,
  },
}