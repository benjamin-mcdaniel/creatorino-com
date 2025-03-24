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
  try {
    console.log(`Making ${options.method || 'GET'} request to ${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Parse the response as JSON
    const responseData = await response.json();
    
    // Handle non-OK responses
    if (!response.ok) {
      console.error('API request failed:', response.status, responseData);
      throw new Error(responseData.error || `API request failed with status ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error in authFetch:', error);
    throw error;
  }
}

// === PROFILE API METHODS ===

/**
 * Fetch the profile of the current logged-in user
 */
export async function fetchProfileFromWorker() {
  try {
    console.log('Fetching profile from worker');
    const result = await authFetch('/profile', {
      method: 'GET'
    });
    
    console.log('Profile fetch result:', result);
    
    // Return data in the same format as the previous Supabase implementation
    return result;
  } catch (error) {
    console.error('Error fetching profile from worker:', error.message);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Update the profile of the current logged-in user
 */
export async function updateProfileWithWorker(updates) {
  try {
    console.log('Updating profile with worker:', updates);
    const result = await authFetch('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    console.log('Profile update result:', result);
    
    // Return data in the same format as the previous Supabase implementation
    return result;
  } catch (error) {
    console.error('Error updating profile with worker:', error.message);
    return { data: null, error: { message: error.message } };
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
