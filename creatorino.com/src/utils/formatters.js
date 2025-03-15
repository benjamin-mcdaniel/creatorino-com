// src/utils/formatters.js

/**
 * Format a number to a human-readable format (e.g., 1.2K, 3.4M)
 * @param {number} num - The number to format
 * @param {number} digits - Number of decimal digits to show
 * @returns {string} Formatted number
 */
export function formatNumber(num, digits = 1) {
  if (num === null || num === undefined) return '0';

  // Convert to number if it's a string
  if (typeof num === 'string') {
    num = parseFloat(num);
  }

  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' }
  ];
  
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function(item) {
      return num >= item.value;
    });
    
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
}

/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
}

/**
 * Format a duration in seconds to a readable format (e.g., "1h 30m")
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  let result = '';
  
  if (hours > 0) {
    result += `${hours}h `;
  }
  
  if (minutes > 0 || hours > 0) {
    result += `${minutes}m `;
  }
  
  if (remainingSeconds > 0 && hours === 0) {
    result += `${remainingSeconds}s`;
  }
  
  return result.trim();
}

/**
 * Format a percentage with the specified precision
 * @param {number} value - The value to format (e.g., 0.123)
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted percentage (e.g., "12.3%")
 */
export function formatPercentage(value, precision = 1) {
  if (value === null || value === undefined) return '0%';
  
  return (value * 100).toFixed(precision) + '%';
}

/**
 * Format money values
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., "USD")
 * @returns {string} Formatted currency value
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}