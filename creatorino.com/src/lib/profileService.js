// lib/profileService.js

import { supabase } from './supabaseClient';

/**
 * Fetch the profile of the current logged-in user, create if doesn't exist
 */
export async function fetchUserProfile() {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) throw new Error('No user found');
    const user = userData.user;
    
    // Try to fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    // If profile exists, return it
    if (existingProfile) {
      return { data: existingProfile, error: null };
    }
    
    // If there was an error other than "not found", throw it
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    // Profile doesn't exist, create a new one
    console.log('Creating new profile for user', user.id);
    
    const newProfile = {
      id: user.id,
      first_name: '',
      last_name: '',
      nickname: user.email.split('@')[0],
      bio: '',
      avatar_url: '',
      updated_at: new Date().toISOString()
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();
      
    if (createError) throw createError;
    
    return { data: createdProfile, error: null };
  } catch (error) {
    console.error('Error with profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Update the profile of the current logged-in user
 */
export async function updateUserProfile(updates) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) throw new Error('No user found');
    
    // Add updated_at timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', userData.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { data: null, error };
  }
}

/**
 * Upload an avatar image for the current user
 */
export async function uploadAvatar(file) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) throw new Error('No user found');
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // First create the bucket if it doesn't exist
    // Using a constant bucket name that we know we want to use
    const BUCKET_NAME = 'avatars';
    
    // First check if we can access existing objects, which implicitly checks if bucket exists and is accessible
    try {
      console.log(`Checking if bucket '${BUCKET_NAME}' exists and is accessible...`);
      await supabase.storage.from(BUCKET_NAME).list();
      console.log(`Bucket '${BUCKET_NAME}' is accessible.`);
    } catch (bucketError) {
      console.error(`Error accessing bucket '${BUCKET_NAME}':`, bucketError);
      
      // Try to create the bucket
      try {
        console.log(`Attempting to create bucket '${BUCKET_NAME}'...`);
        
        // Note: createBucket might require admin privileges
        const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true, // Make bucket publicly accessible
          fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
        });
        
        if (createBucketError) {
          throw new Error(`Failed to create bucket: ${createBucketError.message}`);
        }
        
        console.log(`Bucket '${BUCKET_NAME}' created successfully.`);
      } catch (createError) {
        console.error('Error creating bucket:', createError);
        throw new Error(`Cannot access or create storage bucket: ${createError.message}`);
      }
    }
    
    // Check if any previous avatar exists and remove it
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userData.user.id)
      .single();
    
    if (existingProfile?.avatar_url) {
      try {
        // Try to extract filename from the URL
        const url = new URL(existingProfile.avatar_url);
        const pathParts = url.pathname.split('/');
        const oldFileName = pathParts[pathParts.length - 1];
        
        if (oldFileName) {
          console.log(`Attempting to remove old avatar: ${oldFileName}`);
          const { error: removeError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([oldFileName]);
            
          if (removeError) {
            console.warn('Could not remove old avatar:', removeError);
          } else {
            console.log('Successfully removed old avatar.');
          }
        }
      } catch (error) {
        console.warn('Error removing old avatar:', error);
        // Continue with upload anyway
      }
    }
    
    console.log(`Uploading new avatar to '${BUCKET_NAME}' with filename '${fileName}'...`);
    
    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error('Upload failed:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    console.log('Avatar uploaded successfully.');
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);
    
    console.log('Public URL for avatar:', publicUrl);
    
    // Update the profile with the new avatar URL
    const { data, error } = await updateUserProfile({
      avatar_url: publicUrl
    });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading avatar:', error.message);
    return { data: null, error };
  }
}