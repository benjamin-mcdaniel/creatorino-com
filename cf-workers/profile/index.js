/**
 * Profile API Module
 * 
 * This file has been reverted as we're moving back to client-side profile management.
 */

export async function handleRequest(request) {
  return new Response("Profile functionality has been moved client-side", {
    headers: {
      "content-type": "text/plain",
    },
  });
}