/**
 * Creatorino API Worker
 * 
 * Unified API entry point that routes requests to feature-specific handlers
 */

// Import feature modules
import * as profileApi from './profile/index.js';
import * as youtubeApi from './youtube/index.js';
// Import additional feature modules as they are developed

// Import common utilities
import { errorResponse } from './common/utils.js';

/**
 * Main request handler for the worker
 */
async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Log environment for debugging
  console.log('ENV VARS:', {
    hasSupabaseUrl: !!env.SUPABASE_URL,
    hasSupabaseKey: !!env.SUPABASE_KEY,
    supabaseUrlPrefix: env.SUPABASE_URL ? env.SUPABASE_URL.substring(0, 10) + '...' : 'undefined',
    envKeys: Object.keys(env)
  });
  
  // Global CORS handling for all routes
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      }
    });
  }
  
  // Log incoming requests
  console.log(`Processing ${request.method} request to ${path}`);
  
  // Route to the appropriate feature handler based on path
  if (path.startsWith('/profile')) {
    return profileApi.handleRequest(request, env, ctx);
  } 
  else if (path.startsWith('/youtube')) {
    return youtubeApi.handleRequest(request, env, ctx);
  }
  
  // Default response for unmatched routes
  return errorResponse('Not found', 404);
}

// Export an object with a fetch method (module format)
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  }
};