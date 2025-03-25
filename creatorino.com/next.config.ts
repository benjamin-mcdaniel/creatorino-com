module.exports = {
  // Use trailing slash to be consistent with server routing
  trailingSlash: true,
  
  // This is required for static exports with Cloudflare Pages
  output: 'export',
  
  // Fix the experimental config format
  outputFileTracingRoot: __dirname,
  
  // This enables SSG to handle any URL pattern for s/[username]
  async exportPathMap(defaultPathMap, { dev }) {
    // Skip this during development
    if (dev) return defaultPathMap;

    // Create a paths map without the dynamic route
    const paths = { ...defaultPathMap };
    
    // Remove the dynamic route which can't be statically generated
    delete paths['/s/[username]'];
    
    // Add a static page for a catch-all fallback WITHOUT query parameters
    paths['/s/fallback'] = { page: '/s/[username]' };
    
    return paths;
  },
  
  // Generate a static site with all features enabled
  images: {
    unoptimized: true,
  },
  
  // No need for API proxy since we're using direct Supabase calls
  async rewrites() {
    return [];
  },
}