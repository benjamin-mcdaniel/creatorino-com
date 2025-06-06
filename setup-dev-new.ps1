# Development Setup Script for Creatorino
# This script sets up the development environment

param(
    [switch]$SkipInstall
)

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Setup-Development {
    Write-ColorOutput "Setting up Creatorino development environment..." "Cyan"
    
    if (-not $SkipInstall) {
        # Install API dependencies
        Write-ColorOutput "Installing API dependencies..." "Cyan"
        Set-Location ".\api"
        npm install
        Set-Location ".."
        
        # Install Frontend dependencies
        Write-ColorOutput "Installing Frontend dependencies..." "Cyan"
        Set-Location ".\frontend"
        npm install
        Set-Location ".."
    }
    
    # Create development config if it doesn't exist
    if (-not (Test-Path "deploy-config.ps1")) {
        Write-ColorOutput "Creating development configuration..." "Cyan"
        Copy-Item "deploy-config.example.ps1" "deploy-config.ps1"
        Write-ColorOutput "WARNING: Please edit deploy-config.ps1 with your API keys before deploying!" "Yellow"
    }
    
    Write-ColorOutput "Development environment ready!" "Green"
    Write-ColorOutput "" 
    Write-ColorOutput "Available commands:" "Cyan"
    Write-ColorOutput "  API Development:" "Cyan"
    Write-ColorOutput "    cd api; npm run dev" "Cyan"
    Write-ColorOutput "  Frontend Development:" "Cyan"
    Write-ColorOutput "    cd frontend; npm run dev" "Cyan"
    Write-ColorOutput "  Deployment Options:" "Cyan"
    Write-ColorOutput "    .\deploy.ps1           # Deploy both backend and frontend" "Cyan"
    Write-ColorOutput "    .\deploy-backend.ps1   # Deploy backend API only" "Cyan"
    Write-ColorOutput "    .\deploy-frontend.ps1  # Deploy frontend website only" "Cyan"
}

# Run setup
Setup-Development
