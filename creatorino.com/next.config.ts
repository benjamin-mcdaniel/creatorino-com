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

    // Instead of trying to map /s to /s/[username], create a specific fallback page
    const paths = { ...defaultPathMap };
    
    // Remove the dynamic route from the export map
    delete paths['/s/[username]'];
    
    // Add a static page for a catch-all fallback
    paths['/s/404'] = { page: '/s/[username]', query: { username: '404' } };
    
    return paths;
  },
  
  // Generate a static site with all features enabled
  images: {
    unoptimized: true,
  },
}