/**
 * API client for Cloudflare Workers
 * 
 * Provides methods to interact with server-side functions running in Cloudflare Workers
 */
import { supabase } from './supabaseClient';

// Base URL for each API worker (will be different in production vs development)
const PROFILE_API_URL = process.env.NODE_ENV === 'production'
  ? 'https://profile-api.benjamin-f-mcdaniel.workers.dev'
  : '/api/profile'; // Uses Next.js rewrite in development

/**
 * Make an authenticated request to an API
 */
async function authFetch(baseUrl, endpoint, options = {}) {
  // Get current session
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (!session) {
    throw new Error('No active session');
  }
  
  // Add auth header
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
    ...options.headers
  };
  
  // Make the request
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });
  
  // Handle non-OK responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// === PROFILE API METHODS ===

/**
 * Fetch the profile of the current logged-in user
 */
export async function fetchProfileFromWorker() {
  try {
    // For the simplified worker structure, we can use an empty path
    // since the worker handles all requests at the root
    return await authFetch(PROFILE_API_URL, '', {
      method: 'GET'
    });
  } catch (error) {
    console.error('Error fetching profile from worker:', error.message);
    return { data: null, error };
  }
}

/**
 * Update the profile of the current logged-in user
 */
export async function updateProfileWithWorker(updates) {
  try {
    // For the simplified worker structure, we can use an empty path
    // since the worker handles all requests at the root
    return await authFetch(PROFILE_API_URL, '', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Error updating profile with worker:', error.message);
    return { data: null, error };
  }
}

// Additional API methods can be added here as needed,
// organized by API type (profile, auth, etc.)
