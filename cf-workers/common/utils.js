/**
 * Common utilities for Cloudflare Workers API
 * 
 * This file has been reverted as we're moving back to client-side functionality.
 */

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}