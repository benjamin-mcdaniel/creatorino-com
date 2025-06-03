# Creator Platform Aggregation System - Project Directions

## Project Overview
Build a web application that allows users to search for content creators across multiple platforms (YouTube, Twitch, Kick) and aggregates their cross-platform presence into unified profiles. The system performs intelligent link discovery to automatically find all connected social media accounts and platforms for each creator.

## Core Objectives

### Primary Goals
1. **Unified Creator Search**: Enable users to search for creators across platforms and view consolidated profiles
2. **Automatic Platform Discovery**: Recursively discover and link all related social media accounts through bio link crawling
3. **Live Database Search**: Provide instant search results from existing creator database
4. **Platform Data Aggregation**: Collect and display metrics from multiple platforms in one interface
5. **Scalable Architecture**: Support 100k+ creator profiles with efficient data storage and retrieval

### User Experience Flow
1. User types creator name → Instant MongoDB search shows existing creators with platform indicators
2. If creator not found → User clicks "Search" → System searches YouTube/Twitch/Kick simultaneously
3. User selects profile from combined results → System performs recursive link discovery
4. System saves comprehensive creator profile with all discovered platforms
5. Future searches return unified profile with cross-platform data

## Technical Architecture

### Technology Stack
- **Frontend**: Vercel (React/Next.js)
- **Backend**: Vercel API routes
- **Database**: MongoDB Atlas
- **External APIs**: YouTube Data API, Twitch API, Kick API (if available)

### API Structure (4 Core Endpoints)

```
/api/search
- Purpose: Search existing creators in MongoDB
- Method: GET
- Returns: [{id, name, platforms: ['youtube', 'twitch'], last_updated}]
- Performance: Instant response for live search

/api/platforms/search
- Purpose: Search external platforms for new creators
- Method: POST
- Body: {query}
- Returns: Combined array from all platforms
- Format: [{platform: 'youtube', name, url, metrics}, ...]

/api/creator/discover-and-create
- Purpose: Recursive platform discovery and profile creation
- Method: POST
- Body: {selected_profile: {platform, url, name}}
- Process: Bio link extraction → Platform search → Recursive discovery
- Returns: Complete unified creator profile

/api/creator/{id}
- Purpose: Get creator profile with auto-refresh
- Method: GET
- Logic: Check if data >5 minutes old, refresh if needed
- Returns: Full creator data + metrics + content links
```

## Link Discovery System

### Recursive Discovery Process
1. Extract bio/description from selected creator profile
2. Parse text for social media URLs using platform-specific patterns
3. Fetch profile data from each discovered platform
4. Extract links from new platform bios
5. Continue recursively until no new platforms found
6. Save unified profile with all discovered platforms

### Supported Platforms (Priority Order)
**Primary Platforms:**
- YouTube (subscribers, videos, channel data)
- Twitch (followers, streams, bio)
- Kick (followers, streams, bio)

**Secondary Platforms:**
- Twitter/X (followers, recent tweets)
- TikTok (public data only)
- Patreon (supporter count, tiers)
- Instagram (public profiles)
- Discord (public servers only)

**Platform Limits**: Maximum 2 additional platforms beyond the named core platforms

## Data Architecture

### MongoDB Collections Structure
```javascript
creators: {
  _id: ObjectId,
  name: String,
  unified_handle: String,
  platforms: {
    youtube: {
      url: String,
      channel_id: String,
      subscribers: Number,
      bio: String,
      last_updated: Date
    },
    twitch: {
      url: String,
      username: String,
      followers: Number,
      bio: String,
      last_updated: Date
    }
    // ... other platforms
  },
  content_links: [{
    platform: String,
    type: String, // 'video', 'stream', 'tweet'
    url: String,
    title: String,
    timestamp: Date,
    metadata: Object
  }],
  discovery_completed: Date,
  last_updated: Date,
  status: String // 'active', 'stale', 'error'
}

search_index: {
  terms: [String],
  creator_id: ObjectId,
  platforms: [String],
  popularity_score: Number
}
```

### Indexing Strategy
- Text index on creator names for search
- Compound index on platforms for filtering
- TTL index for cache expiration (optional)
- Sparse indexes for platform-specific data

## Performance & Data Management

### Freshness Strategy
- **5-minute TTL**: Refresh platform data when viewing creator profiles if older than 5 minutes
- **Background Jobs**: Not implemented initially, manual refresh only
- **Stale Data Handling**: Display last updated timestamp, allow manual refresh

### Content Link Storage
- **Save Links Only**: Store URLs to videos/tweets/streams, not content data
- **Basic Metadata**: Title, timestamp, platform type
- **Browser Rendering**: Let client fetch and display content via stored URLs
- **Storage Limit**: Last 25 entries per platform to control database size

## Project Constraints & Boundaries

### What We're NOT Building (Initially)
- Real-time live search across external platforms
- Heavy caching layer (Redis)
- Fuzzy matching algorithms
- Cross-platform identity verification
- Content data storage (videos, full tweets)
- Advanced analytics or trending systems
- User authentication or personalization

### Platform API Limitations
- Respect rate limits for each platform API
- Handle API key rotation and quotas
- Graceful degradation when APIs are unavailable
- No scraping - API-only approach

### Scalability Considerations
- Design for 100k+ creator profiles
- Efficient MongoDB queries with proper indexing
- Minimize API calls through caching strategies
- Horizontal scaling capability through Vercel functions

## Development Phases

### Phase 1: Core Search & Discovery
- MongoDB integration and basic search
- Single platform API integration (YouTube)
- Basic creator profile creation
- Simple link discovery for one platform

### Phase 2: Multi-Platform Support
- Add Twitch and Kick APIs
- Implement recursive link discovery
- Cross-platform profile consolidation
- Enhanced search results display

### Phase 3: Content Timeline
- Content link storage and display
- Basic metrics tracking over time
- Profile refresh automation
- Performance optimization

## Success Metrics
- Sub-200ms response time for database searches
- Successfully discover 80%+ of creator's linked platforms
- Handle 1000+ concurrent searches
- 95%+ API success rate for platform data retrieval

## Future Enhancements (Not in Scope)
- Machine learning for identity matching
- Real-time data streaming
- Advanced analytics and trend detection
- User accounts and saved creators
- API rate limiting and caching optimization
- Content recommendation systems

This document serves as the complete specification for building the Creator Platform Aggregation System with all agreed-upon constraints, technical decisions, and implementation boundaries.