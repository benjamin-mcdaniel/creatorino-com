// components/dashboard/SocialLinks/utils.js

// Pre-defined theme options
export const THEME_OPTIONS = [
    {
      id: 'default',
      name: 'Classic',
      description: 'Clean, professional look with subtle colors',
      primary_color: '#0070f3',
      secondary_color: '#7928ca',
      text_color: '#333333',
      button_color: '#333333',
      button_text_color: '#ffffff',
      background_color: '#ffffff',
      is_premium: false,
      thumbnail_url: '/images/themes/classic.jpg'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Sleek dark interface for night owls',
      primary_color: '#bb86fc',
      secondary_color: '#03dac6',
      text_color: '#ffffff',
      button_color: '#bb86fc',
      button_text_color: '#000000',
      background_color: '#121212',
      is_premium: false,
      thumbnail_url: '/images/themes/dark.jpg'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean, simple, and distraction-free',
      primary_color: '#000000',
      secondary_color: '#666666',
      text_color: '#000000',
      button_color: '#ffffff',
      button_text_color: '#000000',
      background_color: '#f5f5f5',
      is_premium: false,
      thumbnail_url: '/images/themes/minimalist.jpg'
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Bold and bright with eye-catching colors',
      primary_color: '#ff00ff',
      secondary_color: '#00ffff',
      text_color: '#ffffff',
      button_color: '#ff00ff',
      button_text_color: '#ffffff',
      background_color: '#000000',
      is_premium: true,
      thumbnail_url: '/images/themes/neon.jpg'
    },
    {
      id: 'gradient',
      name: 'Gradient',
      description: 'Smooth color transitions for a modern look',
      primary_color: '#6366f1',
      secondary_color: '#8b5cf6',
      text_color: '#ffffff',
      button_color: 'rgba(255, 255, 255, 0.2)',
      button_text_color: '#ffffff',
      background_color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      is_premium: true,
      thumbnail_url: '/images/themes/gradient.jpg'
    },
    {
      id: 'pastel',
      name: 'Pastel',
      description: 'Soft, soothing colors for a gentle presence',
      primary_color: '#9ad0f5',
      secondary_color: '#f5c0c0',
      text_color: '#5a5a5a',
      button_color: '#f5c0c0',
      button_text_color: '#5a5a5a',
      background_color: '#f8f9fa',
      is_premium: false,
      thumbnail_url: '/images/themes/pastel.jpg'
    }
  ];
  
  // Platform options with standardized keys and names
  export const PLATFORM_OPTIONS = [
    { key: 'twitter', name: 'Twitter / X', color: '#1DA1F2', regex: /twitter\.com|x\.com/ },
    { key: 'instagram', name: 'Instagram', color: '#E1306C', regex: /instagram\.com/ },
    { key: 'youtube', name: 'YouTube', color: '#FF0000', regex: /youtube\.com|youtu\.be/ },
    { key: 'tiktok', name: 'TikTok', color: '#000000', regex: /tiktok\.com/ },
    { key: 'facebook', name: 'Facebook', color: '#1877F2', regex: /facebook\.com|fb\.com/ },
    { key: 'linkedin', name: 'LinkedIn', color: '#0A66C2', regex: /linkedin\.com/ },
    { key: 'github', name: 'GitHub', color: '#171515', regex: /github\.com/ },
    { key: 'twitch', name: 'Twitch', color: '#9146FF', regex: /twitch\.tv/ },
    { key: 'discord', name: 'Discord', color: '#5865F2', regex: /discord\.com|discord\.gg/ },
    { key: 'patreon', name: 'Patreon', color: '#FF424D', regex: /patreon\.com/ },
    { key: 'spotify', name: 'Spotify', color: '#1DB954', regex: /spotify\.com/ },
    { key: 'medium', name: 'Medium', color: '#000000', regex: /medium\.com/ },
    { key: 'substack', name: 'Substack', color: '#FF6719', regex: /substack\.com/ }
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
   * Detect platform from URL
   * @param {string} url - The URL to check
   * @returns {string|null} - Platform key or null if not matched
   */
  export function detectPlatformFromUrl(url) {
    if (!url) return null;
    
    for (const platform of PLATFORM_OPTIONS) {
      if (platform.regex.test(url)) {
        return platform.key;
      }
    }
    
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
  
  /**
   * Validate a URL
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether URL is valid
   */
  export function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }