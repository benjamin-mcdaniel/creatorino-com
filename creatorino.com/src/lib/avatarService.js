import { supabase } from './supabaseClient';

/**
 * Avatar Service
 * 
 * Handles avatar uploads and retrievals with resizing via Edge Function
 */

/**
 * Process and upload an avatar using the Edge Function
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} - URLs for the processed avatars and updated profile
 */
export async function uploadAndProcessAvatar(file) {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    
    console.log('Starting avatar upload and processing...');
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File size exceeds 2MB limit');
    }
    
    // Convert file to base64
    const base64 = await convertFileToBase64(file);
    
    // Get session for auth header
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('User must be authenticated to upload an avatar');
    }
    
    // Call the process-avatar Edge Function
    const { data, error } = await supabase.functions.invoke('process-avatar', {
      body: {
        image: base64,
        filename: file.name,
        contentType: file.type
      }
    });
    
    if (error) {
      console.error('Error calling process-avatar function:', error);
      throw new Error(`Error processing avatar: ${error.message}`);
    }
    
    console.log('Avatar processed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in uploadAndProcessAvatar:', error);
    throw error;
  }
}

/**
 * Convert a file to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string representation of the file
 */
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Preload avatar image to improve perceived load time
 * @param {string} url - URL of the avatar to preload
 * @returns {Promise<void>}
 */
export function preloadAvatar(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('Invalid URL'));
      return;
    }
    
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to preload avatar'));
    
    // Add cache-busting parameter to prevent browser caching issues
    img.src = url.includes('?') 
      ? `${url}&_t=${Date.now()}` 
      : `${url}?_t=${Date.now()}`;
  });
}

/**
 * Get avatar from cache or storage
 * @param {string} userId - User ID
 * @param {boolean} small - Whether to get the small version
 * @returns {string|null} - URL of the avatar or null if not found
 */
export function getCachedAvatar(userId, small = false) {
  if (!userId) return null;
  
  try {
    const cacheKey = `avatar_${small ? 'small_' : ''}${userId}`;
    const cached = localStorage.getItem(cacheKey);
    
    // Check if cache is recent (1 hour)
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      const isRecent = (Date.now() - timestamp) < 60 * 60 * 1000; // 1 hour in milliseconds
      
      if (isRecent && url) {
        return url;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached avatar:', error);
    return null;
  }
}

/**
 * Cache avatar URL
 * @param {string} userId - User ID
 * @param {string} url - Avatar URL
 * @param {boolean} small - Whether this is the small version
 */
export function cacheAvatar(userId, url, small = false) {
  if (!userId || !url) return;
  
  try {
    const cacheKey = `avatar_${small ? 'small_' : ''}${userId}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      url,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching avatar:', error);
  }
}

/**
 * Get the appropriate avatar URL based on size
 * @param {Object} profile - User profile object
 * @param {boolean} small - Whether to get the small version
 * @returns {string|null} - URL of the avatar or null if not found
 */
export function getAvatarUrl(profile, small = false) {
  if (!profile) return null;
  
  // For small avatars, first try avatar_url_small, then fall back to avatar_url
  if (small) {
    return profile.avatar_url_small || profile.avatar_url || null;
  }
  
  // Otherwise just return the main avatar URL
  return profile.avatar_url || null;
}
