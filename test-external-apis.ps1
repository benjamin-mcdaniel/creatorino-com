# YouTube and Twitch API Integration Test
# Tests external API connectivity and quota usage

param(
    [string]$ApiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev"
)

# Import configuration
. .\deploy-config.ps1

Write-Host "=== YouTube and Twitch API Integration Test ===" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Green
Write-Host "YouTube API Key: $($YOUTUBE_API_KEY.Substring(0,10))..." -ForegroundColor Green
Write-Host "Twitch Client ID: $($TWITCH_CLIENT_ID.Substring(0,10))..." -ForegroundColor Green
Write-Host ""

$apiTests = @{
    Passed = 0
    Failed = 0
    Details = @()
}

function Test-ExternalApiEndpoint {
    param(
        [string]$Name,
        [string]$Endpoint,
        [scriptblock]$Validator = { $true }
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl$Endpoint" -UseBasicParsing -TimeoutSec 30
        $content = $response.Content | ConvertFrom-Json
        
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
        
        $isValid = & $Validator $response $content
        
        if ($isValid) {
            Write-Host "  [PASS]" -ForegroundColor Green
            $apiTests.Passed++
        } else {
            Write-Host "  [FAIL] Validation failed" -ForegroundColor Red
            $apiTests.Failed++
        }
        
        $apiTests.Details += @{
            Name = $Name
            Status = if ($isValid) { "PASS" } else { "FAIL" }
            Response = $content
        }
        
    } catch {
        Write-Host "  [FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
        $apiTests.Failed++
        $apiTests.Details += @{
            Name = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

# YouTube API Tests
Write-Host "=== YouTube API Tests ===" -ForegroundColor Magenta

Test-ExternalApiEndpoint -Name "YouTube API Status" -Endpoint "/api/status/youtube" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "status" -and
           $content.status -eq "ok"
}

Test-ExternalApiEndpoint -Name "YouTube Search - Gaming" -Endpoint "/api/search/youtube?q=gaming&limit=5" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "results" -and
           $content.results -is [Array] -and
           $content.results.Count -gt 0
}

Test-ExternalApiEndpoint -Name "YouTube Search - Popular Creator" -Endpoint "/api/search/youtube?q=pewdiepie&limit=3" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "results" -and
           $content.results -is [Array]
}

Test-ExternalApiEndpoint -Name "YouTube Channel Details" -Endpoint "/api/creator/youtube/UC-lHJZR3Gqxm24_Vd_AJ5Yw" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "channelId" -and
           $content.platform -eq "youtube"
}

# Twitch API Tests
Write-Host "=== Twitch API Tests ===" -ForegroundColor Magenta

Test-ExternalApiEndpoint -Name "Twitch API Status" -Endpoint "/api/status/twitch" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "status" -and
           $content.status -eq "ok"
}

Test-ExternalApiEndpoint -Name "Twitch Search - Gaming" -Endpoint "/api/search/twitch?q=gaming&limit=5" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "results" -and
           $content.results -is [Array] -and
           $content.results.Count -gt 0
}

Test-ExternalApiEndpoint -Name "Twitch Search - Popular Streamer" -Endpoint "/api/search/twitch?q=ninja&limit=3" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "results" -and
           $content.results -is [Array]
}

Test-ExternalApiEndpoint -Name "Twitch User Details" -Endpoint "/api/creator/twitch/ninja" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "username" -and
           $content.platform -eq "twitch"
}

# Combined Advanced Search Test
Write-Host "=== Combined API Tests ===" -ForegroundColor Cyan

Test-ExternalApiEndpoint -Name "Advanced Search - Combined Results" -Endpoint "/api/search/advanced?q=gaming&limit=10" -Validator {
    param($response, $content)
    $hasResults = $response.StatusCode -eq 200 -and 
                  $content.PSObject.Properties.Name -contains "results" -and
                  $content.results -is [Array]
    
    if ($hasResults -and $content.results.Count -gt 0) {
        # Check if we have results from both platforms
        $platforms = $content.results | ForEach-Object { $_.platform } | Sort-Object -Unique
        Write-Host "    Platforms found: $($platforms -join ', ')" -ForegroundColor Gray
    }
    
    return $hasResults
}

# API Quota and Rate Limiting Tests
Write-Host "=== API Quota Tests ===" -ForegroundColor Yellow

Test-ExternalApiEndpoint -Name "YouTube Quota Usage" -Endpoint "/api/quota/youtube" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "quotaUsage"
}

Test-ExternalApiEndpoint -Name "Twitch Rate Limit Status" -Endpoint "/api/quota/twitch" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "rateLimitRemaining"
}

# Direct API Tests (bypass our backend)
Write-Host ""
Write-Host "=== Direct API Tests ===" -ForegroundColor Cyan

# Test YouTube API directly
Write-Host "Testing YouTube API directly..." -ForegroundColor Yellow
try {
    $youtubeDirectUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=gaming&type=channel&maxResults=1&key=$YOUTUBE_API_KEY"
    $youtubeResponse = Invoke-WebRequest -Uri $youtubeDirectUrl -UseBasicParsing
    
    if ($youtubeResponse.StatusCode -eq 200) {
        $youtubeData = $youtubeResponse.Content | ConvertFrom-Json
        Write-Host "  [PASS] YouTube API direct access working" -ForegroundColor Green
        Write-Host "  Results: $($youtubeData.items.Count) channels found" -ForegroundColor Gray
    }
} catch {
    Write-Host "  [FAIL] YouTube API direct test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "403" -or $_.Exception.Message -match "Forbidden") {
        Write-Host "  This suggests the YouTube API key is invalid or has insufficient permissions" -ForegroundColor Yellow
    }
}

# Test Twitch API directly
Write-Host ""
Write-Host "Testing Twitch API directly..." -ForegroundColor Yellow
try {
    # First get Twitch OAuth token
    $twitchTokenUrl = "https://id.twitch.tv/oauth2/token"
    $twitchTokenBody = @{
        client_id = $TWITCH_CLIENT_ID
        client_secret = $TWITCH_CLIENT_SECRET
        grant_type = "client_credentials"
    }
    
    $twitchTokenResponse = Invoke-WebRequest -Uri $twitchTokenUrl -Method POST -Body $twitchTokenBody -UseBasicParsing
    $twitchTokenData = $twitchTokenResponse.Content | ConvertFrom-Json
    
    if ($twitchTokenResponse.StatusCode -eq 200 -and $twitchTokenData.access_token) {
        # Test Twitch API with token
        $twitchHeaders = @{
            'Client-ID' = $TWITCH_CLIENT_ID
            'Authorization' = "Bearer $($twitchTokenData.access_token)"
        }
        
        $twitchDirectUrl = "https://api.twitch.tv/helix/search/channels?query=gaming&first=1"
        $twitchResponse = Invoke-WebRequest -Uri $twitchDirectUrl -Headers $twitchHeaders -UseBasicParsing
        
        if ($twitchResponse.StatusCode -eq 200) {
            $twitchData = $twitchResponse.Content | ConvertFrom-Json
            Write-Host "  [PASS] Twitch API direct access working" -ForegroundColor Green
            Write-Host "  Results: $($twitchData.data.Count) channels found" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "  [FAIL] Twitch API direct test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "401" -or $_.Exception.Message -match "Unauthorized") {
        Write-Host "  This suggests the Twitch Client ID or Secret is invalid" -ForegroundColor Yellow
    }
}

# Configuration Validation
Write-Host ""
Write-Host "=== API Configuration Validation ===" -ForegroundColor Cyan

$configIssues = @()

if (-not $YOUTUBE_API_KEY -or $YOUTUBE_API_KEY.Length -lt 30) {
    $configIssues += "YouTube API Key appears invalid (too short)"
}

if (-not $TWITCH_CLIENT_ID -or $TWITCH_CLIENT_ID.Length -lt 20) {
    $configIssues += "Twitch Client ID appears invalid (too short)"
}

if (-not $TWITCH_CLIENT_SECRET -or $TWITCH_CLIENT_SECRET.Length -lt 20) {
    $configIssues += "Twitch Client Secret appears invalid (too short)"
}

if ($configIssues.Count -gt 0) {
    Write-Host "Configuration Issues Found:" -ForegroundColor Red
    $configIssues | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
} else {
    Write-Host "All API configuration values appear valid" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "=== External API Test Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $($apiTests.Passed)" -ForegroundColor Green
Write-Host "Failed: $($apiTests.Failed)" -ForegroundColor Red

if ($apiTests.Failed -gt 0) {
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $apiTests.Details | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Common API Issues:" -ForegroundColor Yellow
    Write-Host "1. Invalid or expired API keys" -ForegroundColor White
    Write-Host "2. API quota exceeded" -ForegroundColor White
    Write-Host "3. Rate limiting" -ForegroundColor White
    Write-Host "4. Network connectivity issues" -ForegroundColor White
    Write-Host "5. API endpoint changes" -ForegroundColor White
}

# Save detailed results
$reportPath = ".\external-api-test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$apiTests | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host ""
Write-Host "Detailed external API test report saved to: $reportPath" -ForegroundColor Blue
