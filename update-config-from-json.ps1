# Update PowerShell config from JSON config file
# This script reads the .github/deploy-config.json and updates deploy-config.ps1

$jsonConfigPath = ".\.github\deploy-config.json"
$psConfigPath = ".\deploy-config.ps1"

if (-not (Test-Path $jsonConfigPath)) {
    Write-Host "JSON config file not found: $jsonConfigPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $psConfigPath)) {
    Write-Host "PowerShell config file not found: $psConfigPath" -ForegroundColor Red
    Write-Host "Please copy deploy-config.example.ps1 to deploy-config.ps1 first" -ForegroundColor Yellow
    exit 1
}

try {
    # Read JSON config
    $jsonContent = Get-Content $jsonConfigPath -Raw | ConvertFrom-Json
    
    # Read current PowerShell config
    $psContent = Get-Content $psConfigPath -Raw
    
    # Update values from JSON
    $psContent = $psContent -replace '\$MONGO_CLUSTER = ".*"', "`$MONGO_CLUSTER = `"$($jsonContent.mongoCluster)`""
    $psContent = $psContent -replace '\$MONGO_DATABASE = ".*"', "`$MONGO_DATABASE = `"$($jsonContent.mongoDatabase)`""
    $psContent = $psContent -replace '\$YOUTUBE_API_KEY = ".*"', "`$YOUTUBE_API_KEY = `"$($jsonContent.youtubeKey)`""
    $psContent = $psContent -replace '\$TWITCH_CLIENT_ID = ".*"', "`$TWITCH_CLIENT_ID = `"$($jsonContent.twitchClientId)`""
    $psContent = $psContent -replace '\$TWITCH_CLIENT_SECRET = ".*"', "`$TWITCH_CLIENT_SECRET = `"$($jsonContent.twitchClientSecret)`""
    
    # Add MongoDB username and password if they exist in JSON
    if ($jsonContent.mongoUsername) {
        if ($psContent -notmatch '\$MONGO_USERNAME') {
            $psContent = $psContent -replace '(\$MONGO_DATABASE = ".*")', "`$1`n`$MONGO_USERNAME = `"$($jsonContent.mongoUsername)`""
        } else {
            $psContent = $psContent -replace '\$MONGO_USERNAME = ".*"', "`$MONGO_USERNAME = `"$($jsonContent.mongoUsername)`""
        }
    }
    
    if ($jsonContent.mongoPassword) {
        if ($psContent -notmatch '\$MONGO_PASSWORD') {
            $psContent = $psContent -replace '(\$MONGO_USERNAME = ".*")', "`$1`n`$MONGO_PASSWORD = `"$($jsonContent.mongoPassword)`""
        } else {
            $psContent = $psContent -replace '\$MONGO_PASSWORD = ".*"', "`$MONGO_PASSWORD = `"$($jsonContent.mongoPassword)`""
        }
    }
    
    # Write updated PowerShell config
    Set-Content $psConfigPath $psContent
    
    Write-Host "Successfully updated deploy-config.ps1 from JSON config!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Updated values:" -ForegroundColor Cyan
    Write-Host "  MongoDB Cluster: $($jsonContent.mongoCluster)" -ForegroundColor White
    Write-Host "  MongoDB Database: $($jsonContent.mongoDatabase)" -ForegroundColor White
    Write-Host "  YouTube API Key: $($jsonContent.youtubeKey.Substring(0,10))..." -ForegroundColor White
    Write-Host "  Twitch Client ID: $($jsonContent.twitchClientId)" -ForegroundColor White
    Write-Host "  Twitch Client Secret: $($jsonContent.twitchClientSecret.Substring(0,10))..." -ForegroundColor White
    
    if ($jsonContent.mongoUsername) {
        Write-Host "  MongoDB Username: $($jsonContent.mongoUsername)" -ForegroundColor White
    }
    if ($jsonContent.mongoPassword) {
        Write-Host "  MongoDB Password: $($jsonContent.mongoPassword.Substring(0,10))..." -ForegroundColor White
    }
      Write-Host ""
    
    # Check what still needs to be configured
    $needsConfig = @()
    
    if ($psContent -match '\$CLOUDFLARE_ACCOUNT_ID = "your-cloudflare-account-id"' -or $psContent -match '\$CLOUDFLARE_API_TOKEN = "your-cloudflare-api-token"') {
        $needsConfig += "  - CLOUDFLARE_ACCOUNT_ID and/or CLOUDFLARE_API_TOKEN"
    }
    
    if ($psContent -match '\$MONGO_APP_ID = "your-mongodb-app-id"' -or $psContent -match '\$MONGO_API_KEY = "your-mongodb-data-api-key"') {
        $needsConfig += "  - MONGO_APP_ID and/or MONGO_API_KEY (MongoDB Data API)"
    }
    
    if ($needsConfig.Count -gt 0) {
        Write-Host "NOTE: You still need to configure:" -ForegroundColor Yellow
        $needsConfig | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
    } else {
        Write-Host "All configuration values are set! Ready for deployment." -ForegroundColor Green
    }

} catch {
    Write-Host "Error updating config: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
