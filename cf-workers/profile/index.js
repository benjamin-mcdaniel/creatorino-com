/**
 * Profile API Module
 * 
 * Handles server-side profile operations that were previously done on the client.
 */

import { 
  createSupabaseClient, 
  getUserIdFromToken,
  jsonResponse,
  errorResponse
} from '../common/utils.js';

/**
 * Fetch the profile of a user
 */
async function fetchUserProfile(userId) {
  try {
    const supabase = createSupabaseClient();
    
    // Try to fetch existing profile
    const existingProfile = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    // If profile exists, return it
    if (existingProfile && existingProfile.length > 0) {
      return { data: existingProfile[0], error: null };
    }
    
    // Profile doesn't exist, create a new one
    console.log('Creating new profile for user', userId);
    
    const newProfile = {
      id: userId,
      first_name: '',
      last_name: '',
      nickname: '', // You would need the email from auth context
      bio: '',
      avatar_url: '',
      updated_at: new Date().toISOString()
    };
    
    const createdProfile = await supabase
      .from('profiles')
      .insert([newProfile]);
      
    return { data: createdProfile[0], error: null };
  } catch (error) {
    console.error('Error with profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Update the profile of a user
 */
async function updateUserProfile(userId, updates) {
  try {
    const supabase = createSupabaseClient();
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const result = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userId);
      
    return { data: result[0], error: null };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Handle profile API requests
 * Export this function to be used by the main router
 */
export async function handleRequest(request) {
  try {
    // Get authenticated user ID
    const userId = await getUserIdFromToken(request);
    
    // Handle profile endpoints
    if (request.method === 'GET') {
      const result = await fetchUserProfile(userId);
      return jsonResponse(result);
    } 
    else if (request.method === 'PUT') {
      const updates = await request.json();
      const result = await updateUserProfile(userId, updates);
      return jsonResponse(result);
    }
    
    // Method not allowed
    return errorResponse('Method not allowed', 405);
  } catch (error) {
    // Handle errors based on type
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return errorResponse(error.message, 500);
  }
}