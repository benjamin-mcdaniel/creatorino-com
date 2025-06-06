# Creatorino Deployment Script
# 
# DEFAULT BEHAVIOR: Deploys backend API only
# 
# Usage:
#   .\deploy.ps1              # Deploy backend API (default)
#   .\deploy.ps1 -Frontend    # Deploy frontend website only
#   .\deploy.ps1 -Both        # Deploy both backend and frontend
#   .\deploy.ps1 -Force       # Skip confirmation prompts
#
# By default, this script deploys the backend API with interactive prompts
# Use flags to deploy frontend or skip prompts

param(
    [switch]$Frontend,    # Deploy frontend instead of backend
    [switch]$Both,        # Deploy both backend and frontend
    [switch]$Force        # Skip all prompts
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
    Write-ColorOutput "=== Creatorino Deployment ===" $InfoColor
    Write-ColorOutput "Default: Deploy Backend API" $InfoColor
    Write-ColorOutput "Use -Frontend to deploy website only" $InfoColor
    Write-ColorOutput "Use -Both to deploy both backend and frontend" $InfoColor
    Write-ColorOutput "" 
    
    # Check prerequisites
    Test-Prerequisites
    
    # Import configuration
    if (-not (Import-Config)) {
        exit 1
    }
    
    # Determine what to deploy based on flags
    if ($Both) {
        $deployAPI = $true
        $deployFrontend = $true
        Write-ColorOutput "Mode: Deploy both backend and frontend" $InfoColor
    } elseif ($Frontend) {
        $deployAPI = $false
        $deployFrontend = $true
        Write-ColorOutput "Mode: Deploy frontend only" $InfoColor
    } else {
        # Default: Deploy backend only
        $deployAPI = $true
        $deployFrontend = $false
        Write-ColorOutput "Mode: Deploy backend API only (default)" $InfoColor
    }
    
    # Interactive prompts unless -Force is used
    if (-not $Force) {
        Write-ColorOutput ""
        if ($deployAPI) {
            Write-ColorOutput "About to deploy your backend API to Cloudflare Workers..." $WarningColor
            Write-ColorOutput "This will:" $InfoColor
            Write-ColorOutput "  1. Install dependencies" $InfoColor
            Write-ColorOutput "  2. Configure API secrets (YouTube, Twitch, MongoDB)" $InfoColor
            Write-ColorOutput "  3. Deploy to: https://$API_WORKER_NAME.$CLOUDFLARE_ACCOUNT_ID.workers.dev" $InfoColor
            $response = Read-Host "Continue with backend deployment? (Y/n)"
            if ($response -eq 'n' -or $response -eq 'N') {
                Write-ColorOutput "Deployment cancelled." $WarningColor
                exit 0
            }
        }
        
        if ($deployFrontend) {
            Write-ColorOutput ""
            Write-ColorOutput "About to deploy your frontend website to Cloudflare Pages..." $WarningColor
            Write-ColorOutput "This will:" $InfoColor
            Write-ColorOutput "  1. Install dependencies" $InfoColor
            Write-ColorOutput "  2. Build the React application" $InfoColor
            Write-ColorOutput "  3. Deploy to: https://$PAGES_PROJECT_NAME.pages.dev" $InfoColor
            $response = Read-Host "Continue with frontend deployment? (Y/n)"
            if ($response -eq 'n' -or $response -eq 'N') {
                Write-ColorOutput "Deployment cancelled." $WarningColor
                exit 0
            }        }
    }
    
    $success = $true
    
    # Deploy API
    if ($deployAPI) {
        Write-ColorOutput ""
        Write-ColorOutput "Starting backend deployment..." $InfoColor
        
        # Set environment variables for child script
        $env:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $env:API_WORKER_NAME = $API_WORKER_NAME
        $env:YOUTUBE_API_KEY = $YOUTUBE_API_KEY
        $env:TWITCH_CLIENT_ID = $TWITCH_CLIENT_ID
        $env:TWITCH_CLIENT_SECRET = $TWITCH_CLIENT_SECRET
        $env:MONGO_API_KEY = $MONGO_API_KEY
        $env:MONGO_APP_ID = $MONGO_APP_ID
        $env:MONGO_CLUSTER = $MONGO_CLUSTER        $env:MONGO_DATABASE = $MONGO_DATABASE
        
        & ".\deploy-backend.ps1" -Force
        if ($LASTEXITCODE -ne 0) {
            $success = $false
            Write-ColorOutput "[ERROR] Backend deployment failed!" $ErrorColor        }
    }
    
    # Deploy Frontend
    if ($deployFrontend -and $success) {
        Write-ColorOutput ""
        Write-ColorOutput "Starting frontend deployment..." $InfoColor
        
        # Set environment variables for child script
        $env:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $env:API_WORKER_NAME = $API_WORKER_NAME
        $env:PAGES_PROJECT_NAME = $PAGES_PROJECT_NAME
        
        & ".\deploy-frontend.ps1" -Force
        if ($LASTEXITCODE -ne 0) {
            $success = $false
            Write-ColorOutput "[ERROR] Frontend deployment failed!" $ErrorColor        }
    }
    
    # Final status
    Write-ColorOutput ""
    if ($success) {
        Write-ColorOutput "[SUCCESS] Deployment completed successfully!" $SuccessColor
        Write-ColorOutput ""
        
        if ($deployAPI) {
            Write-ColorOutput "API URL: https://$API_WORKER_NAME.$CLOUDFLARE_ACCOUNT_ID.workers.dev" $SuccessColor
        }
        if ($deployFrontend) {
            Write-ColorOutput "Website URL: https://$PAGES_PROJECT_NAME.pages.dev" $SuccessColor
        }
        
        Write-ColorOutput ""
        Write-ColorOutput "Quick commands:" $InfoColor
        Write-ColorOutput "  Backend only:  .\deploy.ps1 (default)" $InfoColor
        Write-ColorOutput "  Frontend only: .\deploy.ps1 -Frontend" $InfoColor
        Write-ColorOutput "  Both:          .\deploy.ps1 -Both" $InfoColor
        Write-ColorOutput "  Force deploy:  .\deploy.ps1 -Force" $InfoColor
    } else {
        Write-ColorOutput "[ERROR] Deployment failed!" $ErrorColor
        exit 1
    }
}

# Run the main function
Main
