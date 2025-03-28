/**
 * Utility for caching and managing avatar images
 */

const CACHE_PREFIX = 'avatar_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Get a cached avatar URL for a user
 * @param {string} userId - The user ID
 * @returns {string|null} - The cached avatar URL or null if not found
 */
export function getCachedAvatar(userId) {
  try {
    const cacheItem = localStorage.getItem(`${CACHE_PREFIX}${userId}`);
    
    if (!cacheItem) return null;
    
    const { url, timestamp } = JSON.parse(cacheItem);
    
    // Check if cache has expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${userId}`);
      return null;
    }
    
    return url;
  } catch (error) {
    console.error('Error retrieving cached avatar:', error);
    return null;
  }
}

/**
 * Cache an avatar URL for a user
 * @param {string} userId - The user ID
 * @param {string} avatarUrl - The avatar URL to cache
 */
export function cacheAvatar(userId, avatarUrl) {
  if (!userId || !avatarUrl) return;
  
  try {
    const cacheItem = {
      url: avatarUrl,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`${CACHE_PREFIX}${userId}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching avatar:', error);
  }
}

/**
 * Preload an avatar image into the browser cache
 * @param {string} url - The image URL to preload
 * @returns {Promise} - A promise that resolves when the image is loaded
 */
export function preloadAvatar(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Clear all cached avatars
 */
export function clearAvatarCache() {
  try {
    // Get all keys in localStorage
    const keys = Object.keys(localStorage);
    
    // Filter keys that start with the cache prefix
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    // Remove all cache items
    cacheKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing avatar cache:', error);
  }
}
