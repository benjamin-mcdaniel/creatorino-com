// src/components/dashboard/SocialLinks/utils.js

// Five color theme options
export const COLOR_THEMES = [
  {
    id: 'default',
    name: 'Classic',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    buttonColor: '#333333',
    buttonTextColor: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    buttonColor: '#bb86fc',
    buttonTextColor: '#000000',
  },
  {
    id: 'blue',
    name: 'Cool Blue',
    backgroundColor: '#f0f8ff',
    textColor: '#1e3a8a',
    buttonColor: '#1e40af',
    buttonTextColor: '#ffffff',
  },
  {
    id: 'forest',
    name: 'Forest',
    backgroundColor: '#f0fff4',
    textColor: '#22543d',
    buttonColor: '#276749',
    buttonTextColor: '#ffffff',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    backgroundColor: '#fffbeb',
    textColor: '#9a3412',
    buttonColor: '#c2410c',
    buttonTextColor: '#ffffff',
  }
];

// Keep original theme options for compatibility
export const THEME_OPTIONS = COLOR_THEMES;

// Platform options with standardized keys and names
export const PLATFORM_OPTIONS = [
  { key: 'twitter', name: 'Twitter / X' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'facebook', name: 'Facebook' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'github', name: 'GitHub' },
  { key: 'twitch', name: 'Twitch' },
  { key: 'discord', name: 'Discord' },
  { key: 'patreon', name: 'Patreon' },
  { key: 'spotify', name: 'Spotify' },
  { key: 'medium', name: 'Medium' },
  { key: 'substack', name: 'Substack' }
];

// Font options
export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern)' },
  { value: 'Roboto', label: 'Roboto (Clean)' },
  { value: 'Lato', label: 'Lato (Friendly)' },
  { value: 'Montserrat', label: 'Montserrat (Bold)' },
  { value: 'Poppins', label: 'Poppins (Rounded)' },
  { value: 'Open Sans', label: 'Open Sans (Readable)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant)' }
];

// Button style options
export const BUTTON_STYLES = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'pill', label: 'Pill' },
  { value: 'square', label: 'Square' }
];

/**
 * Validate a URL - simple validation for UI feedback
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export function isValidUrl(url) {
  if (!url) return false;
  
  try {
    // Add protocol if missing
    if (!url.match(/^https?:\/\//i)) {
      url = 'https://' + url;
    }
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Detect platform from URL
 * @param {string} url - The URL to check
 * @returns {string|null} - Platform key or null if not matched
 */
export function detectPlatformFromUrl(url) {
  if (!url) return null;
  
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
  if (urlLower.includes('instagram.com')) return 'instagram';
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
  if (urlLower.includes('tiktok.com')) return 'tiktok';
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
  if (urlLower.includes('linkedin.com')) return 'linkedin';
  if (urlLower.includes('github.com')) return 'github';
  if (urlLower.includes('twitch.tv')) return 'twitch';
  if (urlLower.includes('discord.com') || urlLower.includes('discord.gg')) return 'discord';
  if (urlLower.includes('patreon.com')) return 'patreon';
  if (urlLower.includes('spotify.com')) return 'spotify';
  if (urlLower.includes('medium.com')) return 'medium';
  if (urlLower.includes('substack.com')) return 'substack';
  
  return null;
}

/**
 * Format a number for display (e.g., 1.2K, 3.4M)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  return (num / 1000000).toFixed(1) + 'M';
}

/**
 * Format a date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// For future Supabase integration - database schema design

/**
 * Suggested Supabase Schema:
 * 
 * Table: profiles
 * - id: uuid (primary key, references auth.users.id)
 * - title: text
 * - bio: text
 * - theme_id: text
 * - button_style: text
 * - font_family: text
 * - background_type: text
 * - background_value: text
 * - created_at: timestamp with time zone
 * - updated_at: timestamp with time zone
 * 
 * Table: links
 * - id: uuid (primary key)
 * - profile_id: uuid (foreign key references profiles.id)
 * - title: text
 * - url: text
 * - platform_key: text
 * - description: text
 * - sort_order: integer
 * - created_at: timestamp with time zone
 * - updated_at: timestamp with time zone
 * 
 * Table: link_clicks (for future analytics)
 * - id: uuid (primary key)
 * - link_id: uuid (foreign key references links.id)
 * - visitor_id: text (anonymous identifier)
 * - referrer: text
 * - user_agent: text
 * - created_at: timestamp with time zone
 */