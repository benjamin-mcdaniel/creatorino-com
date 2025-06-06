# Creatorino Unified Deployment Script
# This script orchestrates the deployment of both API and Frontend

param(
    [switch]$SkipAPI,
    [switch]$SkipFrontend,
    [switch]$Force
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
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
    if (Test-Path "deploy-config.ps1") {
        Write-ColorOutput "Loading deployment configuration..." $InfoColor
        . .\deploy-config.ps1
        return $true
    } else {
        Write-ColorOutput "deploy-config.ps1 not found!" $ErrorColor
        Write-ColorOutput "Please copy deploy-config.example.ps1 to deploy-config.ps1 and configure it." $WarningColor
        return $false
    }
}

function Main {
    Write-ColorOutput "=== Creatorino Unified Deployment ===" $InfoColor
    
    # Check prerequisites
    Test-Prerequisites
    
    # Import configuration
    if (-not (Import-Config)) {
        exit 1
    }
    
    # Deployment prompts
    $deployAPI = -not $SkipAPI
    $deployFrontend = -not $SkipFrontend
    
    if (-not $Force) {
        if ($deployAPI) {
            $response = Read-Host "Deploy API Backend? (y/N)"
            $deployAPI = $response -eq 'y' -or $response -eq 'Y'
        }
        
        if ($deployFrontend) {
            $response = Read-Host "Deploy Frontend Website? (y/N)"
            $deployFrontend = $response -eq 'y' -or $response -eq 'Y'
        }
    }
    
    $success = $true
      # Deploy API
    if ($deployAPI) {
        Write-ColorOutput "Starting backend deployment..." $InfoColor
        
        # Set environment variables for child script
        $env:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $env:API_WORKER_NAME = $API_WORKER_NAME
        $env:YOUTUBE_API_KEY = $YOUTUBE_API_KEY
        $env:TWITCH_CLIENT_ID = $TWITCH_CLIENT_ID
        $env:TWITCH_CLIENT_SECRET = $TWITCH_CLIENT_SECRET
        $env:MONGO_API_KEY = $MONGO_API_KEY
        $env:MONGO_APP_ID = $MONGO_APP_ID
        $env:MONGO_CLUSTER = $MONGO_CLUSTER
        $env:MONGO_DATABASE = $MONGO_DATABASE
        
        & ".\deploy-backend.ps1" -Force
        if ($LASTEXITCODE -ne 0) {
            $success = $false
            Write-ColorOutput "Backend deployment failed!" $ErrorColor
        }
    } else {
        Write-ColorOutput "Skipping API deployment" $WarningColor
    }
    
    # Deploy Frontend
    if ($deployFrontend -and $success) {
        Write-ColorOutput "Starting frontend deployment..." $InfoColor
        
        # Set environment variables for child script
        $env:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $env:API_WORKER_NAME = $API_WORKER_NAME
        $env:PAGES_PROJECT_NAME = $PAGES_PROJECT_NAME
        
        & ".\deploy-frontend.ps1" -Force
        if ($LASTEXITCODE -ne 0) {
            $success = $false
            Write-ColorOutput "Frontend deployment failed!" $ErrorColor
        }
    } elseif (-not $deployFrontend) {
        Write-ColorOutput "Skipping Frontend deployment" $WarningColor
    }
    
    # Final status
    if ($success) {
        Write-ColorOutput "=== Deployment Summary ===" $SuccessColor
        Write-ColorOutput "Deployment completed successfully!" $SuccessColor
        Write-ColorOutput ""
        
        if ($deployAPI) {
            Write-ColorOutput "API URL: https://$API_WORKER_NAME.$CLOUDFLARE_ACCOUNT_ID.workers.dev" $InfoColor
        }
        if ($deployFrontend) {
            Write-ColorOutput "Website URL: https://$PAGES_PROJECT_NAME.pages.dev" $InfoColor
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "Available deployment scripts:" $InfoColor
        Write-ColorOutput "  Backend only: .\deploy-backend.ps1" $InfoColor
        Write-ColorOutput "  Frontend only: .\deploy-frontend.ps1" $InfoColor
        Write-ColorOutput "  Both (this script): .\deploy.ps1" $InfoColor
    } else {
        Write-ColorOutput "Deployment failed!" $ErrorColor
        exit 1
    }
}

# Run the main function
Main
