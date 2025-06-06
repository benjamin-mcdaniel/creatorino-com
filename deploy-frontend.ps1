# Creatorino Frontend Deployment Script
# This script deploys the Frontend (Cloudflare Pages)

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
        $script:PAGES_PROJECT_NAME = $env:PAGES_PROJECT_NAME
        
        return $true
    } elseif (Test-Path "deploy-config.ps1") {
        Write-ColorOutput "Loading deployment configuration..." $InfoColor
        
        # Load config file and assign to script scope
        . .\deploy-config.ps1
        $script:CLOUDFLARE_ACCOUNT_ID = $CLOUDFLARE_ACCOUNT_ID
        $script:API_WORKER_NAME = $API_WORKER_NAME
        $script:PAGES_PROJECT_NAME = $PAGES_PROJECT_NAME
        
        return $true
    } else {
        Write-ColorOutput "deploy-config.ps1 not found!" $ErrorColor
        Write-ColorOutput "Please copy deploy-config.example.ps1 to deploy-config.ps1 and configure it." $WarningColor
        return $false
    }
}

function Deploy-Frontend {
    Write-ColorOutput "Deploying Frontend (Cloudflare Pages)..." $InfoColor
    
    # Change to frontend directory
    Set-Location ".\frontend"
    
    try {        # Install dependencies
        Write-ColorOutput "Installing frontend dependencies..." $InfoColor
        npm install
          # Update API URL in frontend files
        Write-ColorOutput "Updating API URL..." $InfoColor
        $apiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev"
          # Update SearchPage.jsx
        $searchPageContent = Get-Content "src\components\SearchPage.jsx" -Raw
        $searchPageContent = $searchPageContent -replace "const API_BASE = 'https://[^']+' // This will be updated automatically during deployment", "const API_BASE = '$apiUrl' // This will be updated automatically during deployment"
        Set-Content "src\components\SearchPage.jsx" $searchPageContent
        
        # Update CreatorProfile.jsx
        $profilePageContent = Get-Content "src\components\CreatorProfile.jsx" -Raw
        $profilePageContent = $profilePageContent -replace "const API_BASE = 'https://[^']+' // This will be updated automatically during deployment", "const API_BASE = '$apiUrl' // This will be updated automatically during deployment"
        Set-Content "src\components\CreatorProfile.jsx" $profilePageContent
        
        # Build the project
        Write-ColorOutput "Building frontend..." $InfoColor
        npm run build
        
        # Deploy to Cloudflare Pages (automatically non-interactive in scripts)
        Write-ColorOutput "Deploying to Cloudflare Pages..." $InfoColor
        wrangler pages deploy dist --project-name $script:PAGES_PROJECT_NAME
        
        Write-ColorOutput "Frontend deployed successfully!" $SuccessColor
        
        # Get the pages URL
        Write-ColorOutput "Frontend URL: https://$script:PAGES_PROJECT_NAME.pages.dev" $InfoColor
        
    } catch {
        Write-ColorOutput "Frontend deployment failed: $_" $ErrorColor
        Set-Location ".."
        return $false
    }
    
    # Return to root directory
    Set-Location ".."
    return $true
}

function Main {
    Write-ColorOutput "=== Creatorino Frontend Deployment ===" $InfoColor
        # Import configuration
    if (-not (Import-Config)) {
        exit 1
    }
    
    Write-ColorOutput "Deploying frontend website to Cloudflare Pages..." $InfoColor
    
    # Deploy Frontend directly
    $success = Deploy-Frontend    # Final status
    if ($success) {
        Write-ColorOutput "[SUCCESS] Frontend deployment completed successfully!" $SuccessColor
        Write-ColorOutput ""
        Write-ColorOutput "Website URL: https://$script:PAGES_PROJECT_NAME.pages.dev" $InfoColor
        Write-ColorOutput ""
        Write-ColorOutput "API URL configured in frontend:" $InfoColor
        Write-ColorOutput "https://$script:API_WORKER_NAME.$script:CLOUDFLARE_ACCOUNT_ID.workers.dev" $InfoColor
        Write-ColorOutput ""
        Write-ColorOutput "Next steps:" $InfoColor
        Write-ColorOutput "1. Test your website functionality" $InfoColor
        Write-ColorOutput "2. Set up custom domain (optional)" $InfoColor
    } else {
        Write-ColorOutput "[ERROR] Frontend deployment failed!" $ErrorColor
        exit 1
    }
}

# Run the main function
Main
