// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// MongoDB Data API helper for Cloudflare Workers
class DatabaseManager {
  constructor(env) {
    this.env = env;
    this.baseUrl = `https://data.mongodb-api.com/app/${env.MONGO_APP_ID}/endpoint/data/v1/action`;
  }

  async find(filter = {}, options = {}) {
    const response = await fetch(`${this.baseUrl}/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.env.MONGO_API_KEY,
      },
      body: JSON.stringify({
        collection: 'creators',
        database: this.env.MONGO_DATABASE,
        dataSource: this.env.MONGO_CLUSTER,
        filter,
        ...options
      })
    });
    return await response.json();
  }

  async insertOne(document) {
    const response = await fetch(`${this.baseUrl}/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.env.MONGO_API_KEY,
      },
      body: JSON.stringify({
        collection: 'creators',
        database: this.env.MONGO_DATABASE,
        dataSource: this.env.MONGO_CLUSTER,
        document
      })
    });
    return await response.json();
  }

  async updateOne(filter, update, options = {}) {
    const response = await fetch(`${this.baseUrl}/updateOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.env.MONGO_API_KEY,
      },
      body: JSON.stringify({
        collection: 'creators',
        database: this.env.MONGO_DATABASE,
        dataSource: this.env.MONGO_CLUSTER,
        filter,
        update,
        ...options
      })
    });
    return await response.json();
  }
}

// YouTube API helper
class YouTubeAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async searchChannels(query, maxResults = 25) {
    try {
      const url = `${this.baseUrl}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items) return [];
      
      return data.items.map(item => ({
        platform: 'youtube',
        id: item.id.channelId,
        name: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.default?.url,
        url: `https://www.youtube.com/channel/${item.id.channelId}`,
        subscribers: null // Will be fetched separately if needed
      }));
    } catch (error) {
      console.error('YouTube API error:', error);
      return [];
    }
  }

  async getChannelDetails(channelId) {
    try {
      const url = `${this.baseUrl}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return null;
      
      const channel = data.items[0];
      return {
        platform: 'youtube',
        id: channelId,
        name: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails?.default?.url,
        banner: channel.brandingSettings?.image?.bannerExternalUrl,
        url: `https://www.youtube.com/channel/${channelId}`,
        subscribers: parseInt(channel.statistics?.subscriberCount || 0),
        videos: parseInt(channel.statistics?.videoCount || 0),
        views: parseInt(channel.statistics?.viewCount || 0),
        links: this.extractLinksFromDescription(channel.snippet.description),
        verified: channel.snippet.customUrl !== undefined
      };
    } catch (error) {
      console.error('YouTube channel details error:', error);
      return null;
    }
  }

  extractLinksFromDescription(description) {
    if (!description) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = description.match(urlRegex) || [];
    return matches.map(url => ({
      url: url,
      platform: this.detectPlatform(url)
    }));
  }

  detectPlatform(url) {
    if (url.includes('twitch.tv')) return 'twitch';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    return 'website';
  }
}

// Twitch API helper
class TwitchAPI {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = null;
    this.baseUrl = 'https://api.twitch.tv/helix';
  }

  async getAccessToken() {
    if (this.accessToken) return this.accessToken;
    
    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`
      });
      
      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Twitch auth error:', error);
      return null;
    }
  }

  async searchChannels(query, maxResults = 25) {
    try {
      const token = await this.getAccessToken();
      if (!token) return [];

      const url = `${this.baseUrl}/search/channels?query=${encodeURIComponent(query)}&first=${Math.min(maxResults, 20)}`;
      const response = await fetch(url, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!data.data) return [];
      
      return data.data.map(channel => ({
        platform: 'twitch',
        id: channel.id,
        name: channel.display_name,
        description: channel.description || '',
        thumbnail: channel.thumbnail_url,
        url: `https://www.twitch.tv/${channel.broadcaster_login}`,
        followers: null // Will be fetched separately if needed
      }));
    } catch (error) {
      console.error('Twitch API error:', error);
      return [];
    }
  }

  async getChannelDetails(channelId) {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      // Get channel info
      const channelResponse = await fetch(`${this.baseUrl}/channels?broadcaster_id=${channelId}`, {
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`
        }
      });
      
      const channelData = await channelResponse.json();
      if (!channelData.data || channelData.data.length === 0) return null;
      
      const channel = channelData.data[0];
      
      // Get follower count
      let followers = 0;
      try {
        const followersResponse = await fetch(`${this.baseUrl}/channels/followers?broadcaster_id=${channelId}`, {
          headers: {
            'Client-ID': this.clientId,
            'Authorization': `Bearer ${token}`
          }
        });
        const followersData = await followersResponse.json();
        followers = followersData.total || 0;
      } catch (e) {
        console.log('Could not fetch follower count');
      }

      return {
        platform: 'twitch',
        id: channelId,
        name: channel.broadcaster_name,
        description: channel.description || '',
        thumbnail: channel.thumbnail_url,
        banner: channel.offline_image_url,
        url: `https://www.twitch.tv/${channel.broadcaster_login}`,
        followers: followers,
        game: channel.game_name,
        links: this.extractLinksFromDescription(channel.description),
        verified: channel.partner || false
      };
    } catch (error) {
      console.error('Twitch channel details error:', error);
      return null;
    }
  }

  extractLinksFromDescription(description) {
    if (!description) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = description.match(urlRegex) || [];
    return matches.map(url => ({
      url: url,
      platform: this.detectPlatform(url)
    }));
  }

  detectPlatform(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('tiktok.com')) return 'tiktok';
    return 'website';
  }
}

// Main request handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      const db = new DatabaseManager(env);
      const youtubeAPI = new YouTubeAPI(env.YOUTUBE_API_KEY);
      const twitchAPI = new TwitchAPI(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);

      // Health check endpoint
      if (path === '/health') {
        return new Response(JSON.stringify({ 
          status: 'ok',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Database status endpoint
      if (path === '/api/db/status') {
        return await handleDatabaseStatus(db, env);
      }

      // Database stats endpoint
      if (path === '/api/db/stats') {
        return await handleDatabaseStats(db);
      }

      // YouTube API status endpoint
      if (path === '/api/status/youtube') {
        return await handleYouTubeStatus(youtubeAPI);
      }

      // Twitch API status endpoint
      if (path === '/api/status/twitch') {
        return await handleTwitchStatus(twitchAPI);
      }

      // YouTube quota endpoint
      if (path === '/api/quota/youtube') {
        return await handleYouTubeQuota(youtubeAPI);
      }

      // Twitch rate limit endpoint
      if (path === '/api/quota/twitch') {
        return await handleTwitchQuota(twitchAPI);
      }

      // Live search endpoint (cached results only)
      if (path === '/api/search/live') {
        return await handleLiveSearch(request, db, url);
      }

      // Advanced search endpoint (searches APIs + cache)
      if (path === '/api/search/advanced') {
        return await handleAdvancedSearch(request, db, youtubeAPI, twitchAPI, url);
      }

      // Get creator profile
      if (path.startsWith('/api/creator/')) {
        return await handleGetCreator(request, db, youtubeAPI, twitchAPI, path);
      }

      // Default response
      return new Response(JSON.stringify({ 
        message: 'Creatorino API',
        endpoints: [
          '/api/search/live?q=query&limit=10',
          '/api/search/advanced?q=query&page=1&limit=25',
          '/api/creator/{platform}/{id}'
        ]
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      console.error('Request error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

// Handle live search (cached results only)
async function handleLiveSearch(request, db, url) {
  const query = url.searchParams.get('q');
  const limit = parseInt(url.searchParams.get('limit')) || 10;

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ creators: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    const results = await db.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'platforms.youtube.name': { $regex: query, $options: 'i' } },
        { 'platforms.twitch.name': { $regex: query, $options: 'i' } }
      ]
    }, { limit });

    const creators = results.documents?.map(doc => {
      // Return the primary platform data (YouTube preferred, then Twitch)
      const youtubeData = doc.platforms?.youtube;
      const twitchData = doc.platforms?.twitch;
      
      return youtubeData || twitchData || {
        platform: 'unknown',
        id: doc._id,
        name: doc.name,
        thumbnail: doc.thumbnail
      };
    }) || [];

    return new Response(JSON.stringify({ creators }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Live search error:', error);
    return new Response(JSON.stringify({ creators: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Handle advanced search (searches APIs + cache)
async function handleAdvancedSearch(request, db, youtubeAPI, twitchAPI, url) {
  const query = url.searchParams.get('q');
  const page = parseInt(url.searchParams.get('page')) || 1;
  const limit = parseInt(url.searchParams.get('limit')) || 25;

  if (!query || query.length < 2) {
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    // Search both YouTube and Twitch APIs
    const [youtubeResults, twitchResults] = await Promise.all([
      youtubeAPI.searchChannels(query, Math.ceil(limit / 2)),
      twitchAPI.searchChannels(query, Math.ceil(limit / 2))
    ]);

    // Combine and limit results
    const allResults = [...youtubeResults, ...twitchResults].slice(0, limit);

    // Save results to cache for future live searches
    for (const result of allResults) {
      try {
        await saveCreatorToCache(db, result);
      } catch (error) {
        console.error('Cache save error:', error);
      }
    }

    return new Response(JSON.stringify({ results: allResults }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return new Response(JSON.stringify({ results: [] }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Handle get creator profile
async function handleGetCreator(request, db, youtubeAPI, twitchAPI, path) {
  const pathParts = path.split('/');
  const platform = pathParts[3];
  const id = pathParts[4];

  if (!platform || !id) {
    return new Response(JSON.stringify({ error: 'Invalid creator path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  try {
    // First try to get from cache
    let creator = null;
    const cached = await db.find({
      $or: [
        { [`platforms.${platform}.id`]: id },
        { [`platforms.${platform}.id`]: { $regex: id, $options: 'i' } }
      ]
    }, { limit: 1 });

    if (cached.documents && cached.documents.length > 0) {
      const doc = cached.documents[0];
      creator = doc.platforms?.[platform];
      
      if (creator) {
        // Add cross-platform data if available
        creator.crossPlatformData = [];
        if (doc.platforms?.youtube && platform !== 'youtube') {
          creator.crossPlatformData.push(doc.platforms.youtube);
        }
        if (doc.platforms?.twitch && platform !== 'twitch') {
          creator.crossPlatformData.push(doc.platforms.twitch);
        }
      }
    }

    // If not in cache or data is old, fetch fresh data
    if (!creator) {
      if (platform === 'youtube') {
        creator = await youtubeAPI.getChannelDetails(id);
      } else if (platform === 'twitch') {
        creator = await twitchAPI.getChannelDetails(id);
      }

      if (creator) {
        await saveCreatorToCache(db, creator);
      }
    }

    if (!creator) {
      return new Response(JSON.stringify({ error: 'Creator not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ creator }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Get creator error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch creator' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Save creator to cache
async function saveCreatorToCache(db, creatorData) {
  try {
    const existingCreator = await db.find({
      [`platforms.${creatorData.platform}.id`]: creatorData.id
    }, { limit: 1 });

    const updateData = {
      name: creatorData.name,
      thumbnail: creatorData.thumbnail,
      [`platforms.${creatorData.platform}`]: creatorData,
      lastUpdated: new Date()
    };

    if (existingCreator.documents && existingCreator.documents.length > 0) {
      // Update existing
      await db.updateOne(
        { _id: existingCreator.documents[0]._id },
        { $set: updateData }
      );
    } else {
      // Insert new
      await db.insertOne(updateData);
    }
  } catch (error) {
    console.error('Cache save error:', error);
  }
}

// Database status handler
async function handleDatabaseStatus(db, env) {
  try {
    // Test a simple find operation
    const testResult = await db.find({}, { limit: 1 });
    
    return new Response(JSON.stringify({
      connected: true,
      database: env.MONGO_DATABASE,
      cluster: env.MONGO_CLUSTER,
      timestamp: new Date().toISOString(),
      testQuery: 'success'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Database stats handler
async function handleDatabaseStats(db) {
  try {
    const stats = await db.find({}, { limit: 0 }); // Get count only
    
    return new Response(JSON.stringify({
      totalCreators: stats.documents?.length || 0,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// YouTube API status handler
async function handleYouTubeStatus(youtubeAPI) {
  try {
    // Test a simple search to verify API key
    const testResults = await youtubeAPI.searchChannels('test', 1);
    
    return new Response(JSON.stringify({
      status: 'ok',
      quotaUsage: 'unknown', // YouTube doesn't provide quota info via API
      lastTest: new Date().toISOString(),
      testResults: testResults.length
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: error.message,
      lastTest: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Twitch API status handler
async function handleTwitchStatus(twitchAPI) {
  try {
    // Test getting access token
    const token = await twitchAPI.getAccessToken();
    
    return new Response(JSON.stringify({
      status: 'ok',
      tokenValid: !!token,
      lastTest: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      tokenValid: false,
      error: error.message,
      lastTest: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// YouTube quota handler
async function handleYouTubeQuota(youtubeAPI) {
  return new Response(JSON.stringify({
    quotaUsage: 'unknown',
    quotaLimit: 10000, // Default daily quota
    note: 'YouTube API does not provide quota usage information',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

// Twitch quota handler
async function handleTwitchQuota(twitchAPI) {
  return new Response(JSON.stringify({
    rateLimitRemaining: 'unknown',
    rateLimitReset: 'unknown',
    note: 'Twitch rate limit information not available through client credentials flow',
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
