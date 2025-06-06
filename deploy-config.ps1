# Creatorino Deployment Configuration
# Copy this file to deploy-config.ps1 and fill in your actual values

# Cloudflare Account Information
$CLOUDFLARE_ACCOUNT_ID = "5267338e6e637da4f95322d02fba6025"
$CLOUDFLARE_API_TOKEN = "12f367b9bcc4bd962430a0a429a7dd700cb3d"

# API Worker Configuration
$API_WORKER_NAME = "creatorino-api"

# Frontend Configuration (Cloudflare Pages)
$PAGES_PROJECT_NAME = "creatorino-frontend"

# MongoDB Configuration (Data API)
$MONGO_APP_ID = "mdb_sa_id_683ce865fadd2a215fe6f756"  # Still needs to be configured in MongoDB Atlas
$MONGO_API_KEY = "mdb_sa_sk_2aFBzQIWHgUP5cXAGLTXuO1idcshGmzPylSftDpu"  # Still needs to be configured in MongoDB Atlas
$MONGO_CLUSTER = "cluster0.fbfpthy.mongodb.net"
$MONGO_DATABASE = "creatorino"
$MONGO_USERNAME = "creatorino-api"
$MONGO_PASSWORD = "7gDFxDywzW4e4dk3tHfbEhMKgdR2juSXU"

# YouTube API Configuration
$YOUTUBE_API_KEY = "AIzaSyAut7DLNDoT0I7QFn75yyRMLpB5H6grKts"

# Twitch API Configuration
$TWITCH_CLIENT_ID = "2y2g6iylmsg32tbpx5bni79gyqprrs"
$TWITCH_CLIENT_SECRET = "d5tspqth8kr5chh3e12uh31kjtl79w"

# Deployment Settings
$DEPLOY_API = $true
$DEPLOY_FRONTEND = $true






