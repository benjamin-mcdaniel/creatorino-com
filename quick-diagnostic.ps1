# Quick Diagnostic Script for Creatorino
# Performs rapid checks to identify common issues

Write-Host "=== Creatorino Quick Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Import configuration
try {
    . .\deploy-config.ps1
    Write-Host "[OK] Configuration file loaded" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Could not load deploy-config.ps1" -ForegroundColor Red
    Write-Host "Please ensure the file exists and is properly formatted" -ForegroundColor Yellow
    exit 1
}

$issues = @()
$warnings = @()

# Check 1: Basic configuration
Write-Host "1. Checking configuration..." -ForegroundColor Yellow

if (-not $CLOUDFLARE_ACCOUNT_ID -or $CLOUDFLARE_ACCOUNT_ID -eq "your_account_id") {
    $issues += "Cloudflare Account ID not configured"
}

if (-not $CLOUDFLARE_API_TOKEN -or $CLOUDFLARE_API_TOKEN -eq "your_api_token") {
    $issues += "Cloudflare API Token not configured"
}

if (-not $MONGO_APP_ID -or $MONGO_APP_ID -eq "your_mongo_app_id") {
    $issues += "MongoDB App ID not configured"
}

if (-not $YOUTUBE_API_KEY -or $YOUTUBE_API_KEY -eq "your_youtube_api_key") {
    $issues += "YouTube API Key not configured"
}

if (-not $TWITCH_CLIENT_ID -or $TWITCH_CLIENT_ID -eq "your_twitch_client_id") {
    $issues += "Twitch Client ID not configured"
}

if ($issues.Count -eq 0) {
    Write-Host "   [OK] All configuration values appear to be set" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Configuration issues found" -ForegroundColor Red
}

# Check 2: Frontend accessibility
Write-Host ""
Write-Host "2. Checking frontend accessibility..." -ForegroundColor Yellow

try {
    $frontendUrl = "https://creatorino-frontend.pages.dev"
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing -TimeoutSec 10
    
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   [OK] Frontend is accessible" -ForegroundColor Green
        
        # Check if API URL is embedded
        $apiUrl = "https://creatorino-api.5267338e6e637da4f95322d02fba6025.workers.dev"
        if ($frontendResponse.Content -match [regex]::Escape($apiUrl)) {
            Write-Host "   [OK] API URL is embedded in frontend" -ForegroundColor Green
        } else {
            $warnings += "API URL may not be properly embedded in frontend"
        }
    } else {
        $issues += "Frontend returned status code: $($frontendResponse.StatusCode)"
    }
} catch {
    $issues += "Frontend is not accessible: $($_.Exception.Message)"
}

# Check 3: API accessibility
Write-Host ""
Write-Host "3. Checking API accessibility..." -ForegroundColor Yellow

try {
    $apiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev"
    $apiResponse = Invoke-WebRequest -Uri "$apiUrl/health" -UseBasicParsing -TimeoutSec 10
    
    if ($apiResponse.StatusCode -eq 200) {
        $apiData = $apiResponse.Content | ConvertFrom-Json
        if ($apiData.status -eq "ok") {
            Write-Host "   [OK] API is accessible and responding" -ForegroundColor Green
        } else {
            $warnings += "API responded but status is not 'ok'"
        }
    } else {
        $issues += "API returned status code: $($apiResponse.StatusCode)"
    }
} catch {
    $issues += "API is not accessible: $($_.Exception.Message)"
}

# Check 4: CORS configuration
Write-Host ""
Write-Host "4. Checking CORS configuration..." -ForegroundColor Yellow

try {
    $corsHeaders = @{
        'Origin' = 'https://creatorino-frontend.pages.dev'
    }
    $corsResponse = Invoke-WebRequest -Uri "$apiUrl/health" -Headers $corsHeaders -UseBasicParsing -TimeoutSec 10
    
    $allowOrigin = $corsResponse.Headers['Access-Control-Allow-Origin']
    if ($allowOrigin -eq "*" -or $allowOrigin -eq "https://creatorino-frontend.pages.dev") {
        Write-Host "   [OK] CORS is properly configured" -ForegroundColor Green
    } else {
        $warnings += "CORS may be misconfigured. Allow-Origin: $allowOrigin"
    }
} catch {
    $warnings += "Could not verify CORS configuration"
}

# Check 5: MongoDB connection (basic)
Write-Host ""
Write-Host "5. Checking MongoDB configuration..." -ForegroundColor Yellow

try {
    $mongoTestUrl = "$apiUrl/api/search/live?q=test&limit=1"
    $mongoResponse = Invoke-WebRequest -Uri $mongoTestUrl -UseBasicParsing -TimeoutSec 15
    
    if ($mongoResponse.StatusCode -eq 200) {
        $mongoData = $mongoResponse.Content | ConvertFrom-Json
        if ($mongoData.PSObject.Properties.Name -contains "creators") {
            Write-Host "   [OK] MongoDB integration appears to be working" -ForegroundColor Green
        } else {
            $warnings += "MongoDB returned unexpected response format"
        }
    } else {
        $issues += "MongoDB test returned status code: $($mongoResponse.StatusCode)"
    }
} catch {
    $issues += "MongoDB integration test failed: $($_.Exception.Message)"
}

# Check 6: External API integration (basic)
Write-Host ""
Write-Host "6. Checking external API integration..." -ForegroundColor Yellow

try {
    $apiTestUrl = "$apiUrl/api/search/advanced?q=test&limit=1"
    $apiTestResponse = Invoke-WebRequest -Uri $apiTestUrl -UseBasicParsing -TimeoutSec 20
    
    if ($apiTestResponse.StatusCode -eq 200) {
        $apiTestData = $apiTestResponse.Content | ConvertFrom-Json
        if ($apiTestData.PSObject.Properties.Name -contains "results") {
            Write-Host "   [OK] External API integration appears to be working" -ForegroundColor Green
        } else {
            $warnings += "External APIs returned unexpected response format"
        }
    } else {
        $issues += "External API test returned status code: $($apiTestResponse.StatusCode)"
    }
} catch {
    $issues += "External API integration test failed: $($_.Exception.Message)"
}

# Summary
Write-Host ""
Write-Host "=== Diagnostic Summary ===" -ForegroundColor Cyan

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "Great! No issues detected. Your platform appears to be working correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Run the comprehensive test suite: .\run-all-tests.ps1" -ForegroundColor White
    Write-Host "2. Test the frontend manually at https://creatorino-frontend.pages.dev" -ForegroundColor White
    Write-Host "3. Perform some searches to verify functionality" -ForegroundColor White
    
} elseif ($issues.Count -eq 0) {
    Write-Host "Platform is mostly working, but there are some warnings:" -ForegroundColor Yellow
    $warnings | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Consider running the full test suite for detailed analysis: .\run-all-tests.ps1" -ForegroundColor White
    
} else {
    Write-Host "Issues detected that need attention:" -ForegroundColor Red
    $issues | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Additional warnings:" -ForegroundColor Yellow
        $warnings | ForEach-Object {
            Write-Host "  - $_" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Recommended actions:" -ForegroundColor White
    
    if ($issues | Where-Object { $_ -match "configuration" }) {
        Write-Host "1. Fix configuration issues in deploy-config.ps1" -ForegroundColor White
        Write-Host "2. Redeploy if configuration was changed" -ForegroundColor White
    }
    
    if ($issues | Where-Object { $_ -match "Frontend" }) {
        Write-Host "3. Check Cloudflare Pages deployment status" -ForegroundColor White
        Write-Host "4. Redeploy frontend: .\deploy-frontend.ps1" -ForegroundColor White
    }
    
    if ($issues | Where-Object { $_ -match "API" }) {
        Write-Host "5. Check Cloudflare Workers deployment status" -ForegroundColor White
        Write-Host "6. Redeploy API: .\deploy-backend.ps1" -ForegroundColor White
    }
    
    if ($issues | Where-Object { $_ -match "MongoDB" }) {
        Write-Host "7. Check MongoDB Atlas Data API configuration" -ForegroundColor White
        Write-Host "8. Verify MongoDB credentials in deploy-config.ps1" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Run detailed tests: .\run-all-tests.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "Diagnostic completed." -ForegroundColor Cyan
