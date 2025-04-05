/**
 * Profile service for client-side API calls
 * 
 * Moving back to direct Supabase calls instead of worker API
 */
import { supabase } from './supabaseClient';

/**
 * Fetch the profile of the current logged-in user
 */
export async function fetchProfileFromWorker() {
  try {
    console.log('Fetching profile directly from Supabase');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }
    
    // Try to fetch existing profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }
    
    // If profile exists, return it
    if (data) {
      console.log('Found existing profile');
      return { data, error: null };
    }
    
    // Profile doesn't exist, create a new one
    console.log('Creating new profile for user');
    
    const newProfile = {
      id: session.user.id,
      first_name: '',
      last_name: '',
      nickname: '',
      bio: '',
      avatar_url: '',
      avatar_url_small: '', // Add support for small avatar URL
      updated_at: new Date().toISOString()
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select();
      
    if (createError) {
      console.error('Error creating profile:', createError);
      return { data: null, error: createError };
    }
    
    return { data: createdProfile[0], error: null };
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Update the profile of the current logged-in user
 */
export async function updateProfileWithWorker(updates) {
  try {
    console.log('Updating profile directly in Supabase:', updates);
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('No active session');
    }
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', session.user.id)
      .select();
      
    if (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
    
    console.log('Profile updated successfully');
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { data: null, error: { message: error.message } };
  }
}

/**
 * Fetch YouTube analytics (placeholder)
 */
export async function fetchYouTubeAnalytics() {
  // This is now a placeholder that would be implemented client-side
  return { 
    data: { message: "YouTube analytics functionality coming soon" }, 
    error: null 
  };
}
