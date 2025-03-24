/**
 * API client for Cloudflare Workers
 * 
 * Provides methods to interact with server-side functions running in Cloudflare Workers
 */
import { supabase } from './supabaseClient';

// Base URL for the unified API
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://creatorino-api.benjamin-f-mcdaniel.workers.dev'
  : '/api'; // Uses Next.js rewrite in development

/**
 * Make an authenticated request to the API
 */
async function authFetch(endpoint, options = {}) {
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
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
    return await authFetch('/profile', {
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
    return await authFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Error updating profile with worker:', error.message);
    return { data: null, error };
  }
}

// === YOUTUBE API METHODS ===

/**
 * Fetch YouTube analytics (placeholder)
 */
export async function fetchYouTubeAnalytics() {
  try {
    return await authFetch('/youtube/analytics', {
      method: 'GET'
    });
  } catch (error) {
    console.error('Error fetching YouTube analytics:', error.message);
    return { data: null, error };
  }
}

// Additional API methods can be added here as needed,
// organized by API feature type
