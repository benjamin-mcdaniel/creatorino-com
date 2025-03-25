/**
 * Creatorino API Worker
 * 
 * This file has been reverted to a basic placeholder.
 * We're moving back to client-side handling of profiles.
 */

export default {
  async fetch(request, env, ctx) {
    return new Response("API functionality has been moved client-side", {
      headers: {
        "content-type": "text/plain",
      },
    });
  },
};