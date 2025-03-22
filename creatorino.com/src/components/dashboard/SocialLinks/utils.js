// src/components/dashboard/SocialLinks/utils.js
import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PublicIcon from '@mui/icons-material/Public';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MusicVideoIcon from '@mui/icons-material/MusicVideo'; // Using MusicVideo as a stand-in for TikTok
import VideocamIcon from '@mui/icons-material/Videocam'; // Using Videocam as a stand-in for Twitch
import PodcastsIcon from '@mui/icons-material/Podcasts';
import BookIcon from '@mui/icons-material/Book'; // For Medium, Substack
import HandshakeIcon from '@mui/icons-material/Handshake'; // For Patreon
import ForumIcon from '@mui/icons-material/Forum'; // For Discord

// Color themes for social links page
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

// Map platform keys to icons
const platformIcons = {
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  tiktok: <MusicVideoIcon />,
  twitch: <VideocamIcon />,
  discord: <ForumIcon />,
  patreon: <HandshakeIcon />,
  spotify: <PodcastsIcon />,
  medium: <BookIcon />,
  substack: <BookIcon />,
  default: <PublicIcon />
};

/**
 * Get icon component for a specific platform
 * @param {string} platformKey - Platform identifier
 * @returns {React.ReactElement} - Icon component
 */
export function getIcon(platformKey) {
  return platformIcons[platformKey] || platformIcons.default;
}

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
 * Ensure URL has a protocol
 * @param {string} url - URL to format
 * @returns {string} - URL with protocol
 */
export function ensureUrlProtocol(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}