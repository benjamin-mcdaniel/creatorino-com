# Creatorino Deployment Configuration
# Copy this file to deploy-config.ps1 and fill in your actual values

# Cloudflare Account Information
$CLOUDFLARE_ACCOUNT_ID = "your-cloudflare-account-id"
$CLOUDFLARE_API_TOKEN = "your-cloudflare-api-token"

# API Worker Configuration
$API_WORKER_NAME = "creatorino-api"

# Frontend Configuration (Cloudflare Pages)
$PAGES_PROJECT_NAME = "creatorino-frontend"

# MongoDB Configuration (Data API)
$MONGO_APP_ID = "your-mongodb-app-id"
$MONGO_API_KEY = "your-mongodb-data-api-key"
$MONGO_CLUSTER = "your-cluster-name"
$MONGO_DATABASE = "creatorino"

# YouTube API Configuration
$YOUTUBE_API_KEY = "your-youtube-api-key"

# Twitch API Configuration
$TWITCH_CLIENT_ID = "your-twitch-client-id"
$TWITCH_CLIENT_SECRET = "your-twitch-client-secret"

# Deployment Settings
$DEPLOY_API = $true
$DEPLOY_FRONTEND = $true
