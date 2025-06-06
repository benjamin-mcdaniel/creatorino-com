# Creatorino - Content Creator Discovery Platform

A modern web platform for discovering and exploring content creators across YouTube and Twitch platforms. Built with React frontend and Cloudflare Workers API backend, with MongoDB for caching creator data.

## Features

- **Live Search**: Real-time search through cached creator data
- **Advanced Search**: Search across YouTube and Twitch APIs when no cached results exist
- **Creator Profiles**: Detailed creator pages with statistics and cross-platform links
- **Cross-Platform Discovery**: Automatic detection and linking of creators across platforms
- **Responsive Design**: Modern, mobile-friendly interface

## Architecture

- **Frontend**: React + Vite, deployed on Cloudflare Pages
- **Backend**: Cloudflare Workers API with YouTube and Twitch API integration
- **Database**: MongoDB for caching creator data and search results
- **Deployment**: Automated PowerShell deployment scripts

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm
- Cloudflare account
- MongoDB Atlas account
- YouTube Data API key
- Twitch Developer application

### Development Setup

1. **Clone and setup the project:**
   ```powershell
   git clone <your-repo-url>
   cd creatorino-com
   .\setup-dev.ps1
   ```

2. **Configure your API keys:**
   - Copy `deploy-config.example.ps1` to `deploy-config.ps1`
   - Fill in your API keys and database credentials

3. **Start development servers:**
   ```powershell
   # API development (in one terminal)
   cd api
   npm run dev
   
   # Frontend development (in another terminal)
   cd frontend
   npm run dev
   ```

### API Keys Setup

The project includes a JSON configuration file at `.github/deploy-config.json` with pre-configured API keys. To use these values:

```powershell
# Update PowerShell config from JSON automatically
.\update-config-from-json.ps1
```

This will update your `deploy-config.ps1` with the following values:
- MongoDB cluster, database, username, and password
- YouTube API key  
- Twitch client ID and secret

You still need to manually configure:
- **Cloudflare Account ID and API Token** (from Cloudflare dashboard)
- **MongoDB App ID and Data API Key** (from MongoDB Atlas Data API setup)

#### Manual API Setup (if needed)

#### YouTube Data API
1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create API key credentials
5. Add the key to your `deploy-config.ps1`

#### Twitch API
1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Get your Client ID and Client Secret
4. Add them to your `deploy-config.ps1`

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Set up database user `creatorino-api`
4. Enable Data API access
5. Get your connection details and API key
6. Add them to your `deploy-config.ps1`

### Deployment

You now have three deployment options:

#### 1. Deploy Backend API Only (Default)
```powershell
.\deploy.ps1
```
This is the default behavior. Deploys only the Cloudflare Workers API.

#### 2. Deploy Frontend Website Only
```powershell
.\deploy.ps1 -Frontend
```

#### 3. Deploy Both Backend and Frontend
```powershell
.\deploy.ps1 -Both
```

#### Individual Deployment Scripts
You can also use the individual scripts directly:
```powershell
.\deploy-backend.ps1   # Backend API only
.\deploy-frontend.ps1  # Frontend website only
```

#### Deployment Options
```powershell
# Skip confirmation prompts
.\deploy.ps1 -Force

# Examples
.\deploy.ps1 -Frontend -Force  # Deploy frontend without prompts
.\deploy.ps1 -Both             # Deploy both with prompts
```

Each script will:
- Check prerequisites (Node.js, npm, Wrangler)
- Install dependencies
- Configure secrets/environment variables
- Build and deploy to Cloudflare

## Project Structure

```
creatorino-com/
├── api/                          # Cloudflare Workers API
│   ├── src/
│   │   └── index.js             # Main API handler
│   ├── package.json
│   └── wrangler.toml            # Cloudflare Workers config
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchPage.jsx   # Main search interface
│   │   │   └── CreatorProfile.jsx # Creator profile page
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js           # Vite configuration
├── deploy.ps1                   # Main deployment script
├── setup-dev.ps1               # Development setup script
├── deploy-config.example.ps1    # Configuration template
└── README.md
```

## API Endpoints

- `GET /api/search/live?q=query&limit=10` - Live search cached results
- `GET /api/search/advanced?q=query&page=1&limit=25` - Advanced search with API calls
- `GET /api/creator/{platform}/{id}` - Get creator profile

## Database Schema

### Creators Collection
```javascript
{
  _id: ObjectId,
  name: String,              // Primary display name
  thumbnail: String,         // Primary thumbnail URL
  platforms: {
    youtube: {               // YouTube platform data
      id: String,
      name: String,
      description: String,
      thumbnail: String,
      banner: String,
      subscribers: Number,
      videos: Number,
      views: Number,
      verified: Boolean,
      links: Array
    },
    twitch: {               // Twitch platform data
      id: String,
      name: String,
      description: String,
      thumbnail: String,
      banner: String,
      followers: Number,
      game: String,
      verified: Boolean,
      links: Array
    }
  },
  lastUpdated: Date
}
```

## Cross-Platform Verification

The platform implements a backlink verification system:
- Creators must link to each other's profiles to be considered the same person
- YouTube creator must link to Twitch profile in description
- Twitch creator must link back to YouTube profile
- This prevents unauthorized profile claiming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub Issues page
2. Create a new issue with detailed description
3. Include logs and error messages

## Roadmap

- [ ] Instagram and TikTok platform support
- [ ] Creator analytics and trending metrics
- [ ] User accounts and favorites system
- [ ] Advanced filtering and sorting options
- [ ] Creator collaboration discovery
- [ ] Mobile app versions

## Testing

Creatorino includes comprehensive testing tools to verify all components are working correctly.

### Quick Start Testing

1. **Run the testing guide (recommended first time):**
   ```powershell
   .\test-guide.ps1
   ```

2. **Quick diagnostic check:**
   ```powershell
   .\quick-diagnostic.ps1
   ```

3. **Run all tests:**
   ```powershell
   .\run-all-tests.ps1
   ```

### Available Test Scripts

| Script | Purpose | Duration |
|--------|---------|----------|
| `quick-diagnostic.ps1` | Rapid check of common issues | ~30 seconds |
| `run-all-tests.ps1` | Comprehensive test suite | ~2-3 minutes |
| `test-api.ps1` | Core API functionality tests | ~1 minute |
| `test-mongodb.ps1` | Database connectivity tests | ~1 minute |
| `test-external-apis.ps1` | YouTube/Twitch API tests | ~1 minute |
| `test-frontend-connectivity.ps1` | Frontend-backend communication | ~30 seconds |

### Test Options

**Full Test Suite Options:**
```powershell
# Run with verbose output
.\run-all-tests.ps1 -Verbose

# Skip specific test categories
.\run-all-tests.ps1 -SkipMongo -SkipApis

# Generate HTML report
.\run-all-tests.ps1 -ReportFormat html
```

**Individual Test Options:**
```powershell
# Test with custom API URL
.\test-api.ps1 -ApiUrl "https://your-api-url.workers.dev" -Verbose

# MongoDB tests only
.\test-mongodb.ps1
```

### Test Reports

Tests generate detailed reports:
- **JSON Reports**: `test-results-YYYYMMDD-HHMMSS.json`
- **HTML Reports**: `test-results-YYYYMMDD-HHMMSS.html`
- **Browser Tests**: `api-connectivity-test.html`

### Troubleshooting Tests

**Common Issues:**

1. **MongoDB Connection Failures**
   - Check MongoDB Atlas Data API configuration
   - Verify `MONGO_APP_ID` and `MONGO_API_KEY` in `deploy-config.ps1`
   - Ensure MongoDB cluster is running

2. **API Key Issues**
   - Verify YouTube API key has proper permissions
   - Check Twitch Client ID and Secret
   - Monitor API quotas and rate limits

3. **CORS Errors**
   - Verify CORS headers in API responses
   - Check API URL is embedded in frontend build

4. **Deployment Issues**
   - Check Cloudflare dashboard for service status
   - Re-run deployment scripts
   - Verify environment variables

**Manual Testing Commands:**
```powershell
# Test API directly
curl https://creatorino-api.5267338e6e637da4f95322d02fba6025.workers.dev/health

# Test with CORS headers
curl -H "Origin: https://creatorino-frontend.pages.dev" https://creatorino-api.5267338e6e637da4f95322d02fba6025.workers.dev/health
```

## Deployment

The platform includes automated deployment scripts for both development and production environments.

### Production Deployment

1. **Configure your credentials:**
   ```powershell
   # Copy and edit configuration
   cp deploy-config.example.ps1 deploy-config.ps1
   # Edit deploy-config.ps1 with your actual values
   ```

2. **Deploy everything:**
   ```powershell
   .\deploy-unified.ps1
   ```

3. **Or deploy individually:**
   ```powershell
   # Deploy API only
   .\deploy-backend.ps1
   
   # Deploy frontend only
   .\deploy-frontend.ps1
   ```

### Deployment Verification

After deployment, verify everything is working:

```powershell
# Run comprehensive tests
.\run-all-tests.ps1

# Quick health check
.\quick-diagnostic.ps1
```

### Environment Configuration

The deployment uses environment variables from `deploy-config.ps1`:

```powershell
# Cloudflare
$CLOUDFLARE_ACCOUNT_ID = "your_account_id"
$CLOUDFLARE_API_TOKEN = "your_api_token"

# MongoDB
$MONGO_APP_ID = "your_mongo_app_id"
$MONGO_API_KEY = "your_mongo_api_key"

# APIs
$YOUTUBE_API_KEY = "your_youtube_api_key"
$TWITCH_CLIENT_ID = "your_twitch_client_id"
$TWITCH_CLIENT_SECRET = "your_twitch_client_secret"
```

## API Documentation

### Endpoints

**Health Check:**
```
GET /health
```

**Live Search (Cached Results):**
```
GET /api/search/live?q={query}&limit={limit}
```

**Advanced Search (API + Cache):**
```
GET /api/search/advanced?q={query}&page={page}&limit={limit}
```

**Creator Profile:**
```
GET /api/creator/{platform}/{id}
```

**Status Endpoints (for testing):**
```
GET /api/db/status          # Database connectivity
GET /api/status/youtube     # YouTube API status
GET /api/status/twitch      # Twitch API status
```

### Response Formats

**Live Search Response:**
```json
{
  "creators": [
    {
      "platform": "youtube",
      "id": "channel_id",
      "name": "Creator Name",
      "description": "...",
      "thumbnail": "https://...",
      "url": "https://...",
      "subscribers": 1000000
    }
  ],
  "totalCount": 1
}
```

**Advanced Search Response:**
```json
{
  "results": [
    {
      "platform": "youtube|twitch",
      "id": "creator_id",
      "name": "Creator Name",
      "description": "...",
      "thumbnail": "https://...",
      "url": "https://..."
    }
  ],
  "totalResults": 25,
  "page": 1
}
```

## Platform URLs

- **Frontend**: https://creatorino-frontend.pages.dev
- **API**: https://creatorino-api.5267338e6e637da4f95322d02fba6025.workers.dev