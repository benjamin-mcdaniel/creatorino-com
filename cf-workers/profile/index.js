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
async function fetchUserProfile(userId, env) {
  try {
    console.log('Fetching profile for user:', userId);
    const supabase = createSupabaseClient(env);
    
    // Try to fetch existing profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { data: null, error: profileError };
    }
    
    // If profile exists, return it
    if (profileData) {
      console.log('Found existing profile');
      return { data: profileData, error: null };
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
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert([newProfile]);
      
    if (createError) {
      console.error('Error creating profile:', createError);
      return { data: null, error: createError };
    }
    
    console.log('Successfully created new profile');
    return { data: createdProfile[0] || newProfile, error: null };
  } catch (error) {
    console.error('Error with profile:', error.message);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Update the profile of a user
 */
async function updateUserProfile(userId, updates, env) {
  try {
    console.log('Updating profile for user:', userId);
    const supabase = createSupabaseClient(env);
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
    
    console.log('Profile updated successfully');
    
    // Return the updated profile data
    const { data: refreshedProfile, error: refreshError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (refreshError) {
      console.error('Error fetching updated profile:', refreshError);
      return { data: null, error: refreshError };
    }
    
    return { data: refreshedProfile, error: null };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Handle profile API requests
 * Export this function to be used by the main router
 */
export async function handleRequest(request, env, ctx) {
  try {
    console.log('Profile API received request:', request.method);
    
    // Get authenticated user ID
    const userId = await getUserIdFromToken(request, env);
    
    // Handle profile endpoints
    if (request.method === 'GET') {
      console.log('Processing GET request for user profile');
      const result = await fetchUserProfile(userId, env);
      return jsonResponse(result);
    } 
    else if (request.method === 'PUT') {
      console.log('Processing PUT request to update profile');
      const updates = await request.json();
      console.log('Update data:', JSON.stringify(updates));
      
      const result = await updateUserProfile(userId, updates, env);
      return jsonResponse(result);
    }
    
    // Method not allowed
    console.log('Method not allowed:', request.method);
    return errorResponse('Method not allowed', 405);
  } catch (error) {
    console.error('Error in profile request handler:', error);
    
    // Handle errors based on type
    if (error.message === 'Unauthorized') {
      return errorResponse('Unauthorized', 401);
    }
    
    return errorResponse(error.message, 500);
  }
}