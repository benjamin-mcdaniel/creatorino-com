# Creatorino Backend Deployment Script
# This script deploys the API (Cloudflare Workers)

param(
    [switch]$Force
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    
    # Validate color parameter to avoid invalid color errors
    $validColors = @("Black", "DarkBlue", "DarkGreen", "DarkCyan", "DarkRed", "DarkMagenta", "DarkYellow", "Gray", "DarkGray", "Blue", "Green", "Cyan", "Red", "Magenta", "Yellow", "White")
    if ($Color -notin $validColors) {
        $Color = "White"
    }
    
    Write-Host $Message -ForegroundColor $Color
}

function Test-Prerequisites {
    Write-ColorOutput "Checking prerequisites..." $InfoColor
    
    # Check if Node.js is installed
    try {
        $nodeVersion = node --version
        Write-ColorOutput "Node.js version: $nodeVersion" $SuccessColor
    } catch {
        Write-ColorOutput "Node.js is not installed. Please install Node.js first." $ErrorColor
        exit 1
    }
    
    # Check if npm is installed
    try {
        $npmVersion = npm --version
        Write-ColorOutput "npm version: $npmVersion" $SuccessColor
    } catch {
        Write-ColorOutput "npm is not installed." $ErrorColor
        exit 1
    }
    
    # Check if wrangler is installed globally
    try {
        $wranglerVersion = wrangler --version
        Write-ColorOutput "Wrangler version: $wranglerVersion" $SuccessColor
    } catch {
        Write-ColorOutput "Wrangler not found globally. Installing..." $WarningColor
        npm install -g wrangler
    }
}

function Import-Config {
    # Check if environment variables are set (from parent script)
    if ($env:CLOUDFLARE_ACCOUNT_ID) {
        Write-ColorOutput "Using configuration from parent process..." $InfoColor
        
        # Use environment variables
        $script:CLOUDFLARE_ACCOUNT_ID = $env:CLOUDFLARE_ACCOUNT_ID
        $script:API_WORKER_NAME = $env:API_WORKER_NAME
        $script:YOUTUBE_API_KEY = $env:YOUTUBE_API_KEY
        $script:TWITCH_CLIENT_ID = $env:TWITCH_CLIENT_ID
        $script:TWITCH_CLIENT_SECRET = $env:TWITCH_CLIENT_SECRET
        $script:MONGO_API_KEY = $env:MONGO_API_KEY
        $script:MONGO_APP_ID = $env:MONGO_APP_ID
        $script:MONGO_CLUSTER = $env:MONGO_CLUSTER
        $script:MONGO_DATABASE = $env:MONGO_DATABASE
        
        return $true
    } elseif (Test-Path "deploy-config.ps1") {
        Write-ColorOutput "Loading deployment configuration..." $InfoColor
        
        # Load config file and assign to script scope
        . .\deploy-config.ps1
        $script:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $script:API_WORKER_NAME = $API_WORKER_NAME
        $script:YOUTUBE_API_KEY = $YOUTUBE_API_KEY
        $script:TWITCH_CLIENT_ID = $TWITCH_CLIENT_ID
        $script:TWITCH_CLIENT_SECRET = $TWITCH_CLIENT_SECRET
        $script:MONGO_API_KEY = $MONGO_API_KEY
        $script:MONGO_APP_ID = $MONGO_APP_ID
        $script:MONGO_CLUSTER = $MONGO_CLUSTER
        $script:MONGO_DATABASE = $MONGO_DATABASE
        
        return $true
    } else {
        Write-ColorOutput "deploy-config.ps1 not found!" $ErrorColor
        Write-ColorOutput "Please copy deploy-config.example.ps1 to deploy-config.ps1 and configure it." $WarningColor
        return $false
    }
}

function Deploy-API {
    Write-ColorOutput "Deploying API (Cloudflare Workers)..." $InfoColor
    
    # Change to API directory
    Set-Location ".\api"
    
    try {
        # Install dependencies
        Write-ColorOutput "Installing API dependencies..." $InfoColor
        npm install
        
        # Set up Wrangler secrets
        Write-ColorOutput "Setting up secrets..." $InfoColor        Write-ColorOutput "Setting YouTube API key..." $InfoColor
        Write-Output $script:YOUTUBE_API_KEY | wrangler secret put YOUTUBE_API_KEY --env production
        
        Write-ColorOutput "Setting Twitch client ID..." $InfoColor
        Write-Output $script:TWITCH_CLIENT_ID | wrangler secret put TWITCH_CLIENT_ID --env production
        
        Write-ColorOutput "Setting Twitch client secret..." $InfoColor
        Write-Output $script:TWITCH_CLIENT_SECRET | wrangler secret put TWITCH_CLIENT_SECRET --env production
        
        Write-ColorOutput "Setting MongoDB API key..." $InfoColor
        Write-Output $script:MONGO_API_KEY | wrangler secret put MONGO_API_KEY --env production
        
        Write-ColorOutput "Setting MongoDB App ID..." $InfoColor
        Write-Output $script:MONGO_APP_ID | wrangler secret put MONGO_APP_ID --env production
        
        Write-ColorOutput "Setting MongoDB cluster..." $InfoColor
        Write-Output $script:MONGO_CLUSTER | wrangler secret put MONGO_CLUSTER --env production
          Write-ColorOutput "Setting MongoDB database..." $InfoColor
        Write-Output $script:MONGO_DATABASE | wrangler secret put MONGO_DATABASE --env production
        
        # Deploy the worker (automatically non-interactive in scripts)
        Write-ColorOutput "Deploying worker..." $InfoColor
        wrangler deploy --env production
          Write-ColorOutput "API deployed successfully!" $SuccessColor
        
        # Get the worker URL
        Write-ColorOutput "API URL: https://$script:API_WORKER_NAME.$script:CLOUDFLARE_ACCOUNT_ID.workers.dev" $InfoColor
        
    } catch {
        Write-ColorOutput "API deployment failed: $_" $ErrorColor
        Set-Location ".."
        return $false
    }
    
    # Return to root directory
    Set-Location ".."
    return $true
}

function Main {
    Write-ColorOutput "=== Creatorino Backend Deployment ===" $InfoColor
    
    # Check prerequisites
    Test-Prerequisites
    
    # Import configuration
    if (-not (Import-Config)) {
        exit 1
    }
    
    Write-ColorOutput "Deploying backend API to Cloudflare Workers..." $InfoColor
      # Deploy API directly
    $success = Deploy-API    # Final status
    if ($success) {
        Write-ColorOutput "[SUCCESS] Backend deployment completed successfully!" $SuccessColor
        Write-ColorOutput ""
        Write-ColorOutput "API URL: https://$script:API_WORKER_NAME.$script:CLOUDFLARE_ACCOUNT_ID.workers.dev" $InfoColor
    } else {
        Write-ColorOutput "[ERROR] Backend deployment failed!" $ErrorColor
        exit 1
    }
}

# Run the main function
Main
