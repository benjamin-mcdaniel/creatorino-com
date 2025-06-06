# MongoDB Integration Test
# Specifically tests MongoDB Data API connectivity and operations

param(
    [string]$ApiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev"
)

# Import configuration
. .\deploy-config.ps1

Write-Host "=== MongoDB Integration Test ===" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Green
Write-Host "MongoDB App ID: $MONGO_APP_ID" -ForegroundColor Green
Write-Host "MongoDB Database: $MONGO_DATABASE" -ForegroundColor Green
Write-Host "MongoDB Cluster: $MONGO_CLUSTER" -ForegroundColor Green
Write-Host ""

$mongoTests = @{
    Passed = 0
    Failed = 0
    Details = @()
}

function Test-MongoEndpoint {
    param(
        [string]$Name,
        [string]$Endpoint,
        [scriptblock]$Validator = { $true }
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl$Endpoint" -UseBasicParsing
        $content = $response.Content | ConvertFrom-Json
        
        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Gray
        
        $isValid = & $Validator $response $content
        
        if ($isValid) {
            Write-Host "  [PASS]" -ForegroundColor Green
            $mongoTests.Passed++
        } else {
            Write-Host "  [FAIL] Validation failed" -ForegroundColor Red
            $mongoTests.Failed++
        }
        
        $mongoTests.Details += @{
            Name = $Name
            Status = if ($isValid) { "PASS" } else { "FAIL" }
            Response = $content
        }
        
    } catch {
        Write-Host "  [FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
        $mongoTests.Failed++
        $mongoTests.Details += @{
            Name = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

# Test 1: Database Connection Status
Test-MongoEndpoint -Name "Database Connection" -Endpoint "/api/db/status" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "connected" -and
           $content.connected -eq $true
}

# Test 2: Database Collection Access
Test-MongoEndpoint -Name "Collection Access" -Endpoint "/api/db/collections" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "collections" -and
           $content.collections -is [Array]
}

# Test 3: Creator Cache Count
Test-MongoEndpoint -Name "Creator Cache Count" -Endpoint "/api/db/stats" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "totalCreators" -and
           $content.totalCreators -ge 0
}

# Test 4: Search Cache Functionality
Test-MongoEndpoint -Name "Search Cache" -Endpoint "/api/search/live?q=test&limit=1" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "creators" -and
           $content.creators -is [Array] -and
           $content.PSObject.Properties.Name -contains "totalCount"
}

# Test 5: Recent Creators
Test-MongoEndpoint -Name "Recent Creators" -Endpoint "/api/db/recent?limit=5" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "creators" -and
           $content.creators -is [Array]
}

# Test 6: Database Health Metrics
Test-MongoEndpoint -Name "Database Health" -Endpoint "/api/db/health" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "status" -and
           $content.status -eq "healthy"
}

# Direct MongoDB Data API Test
Write-Host "=== Direct MongoDB Data API Test ===" -ForegroundColor Cyan

try {
    $mongoApiUrl = "https://data.mongodb-api.com/app/$MONGO_APP_ID/endpoint/data/v1/action/find"
    $mongoHeaders = @{
        'Content-Type' = 'application/json'
        'api-key' = $MONGO_API_KEY
    }
    $mongoBody = @{
        collection = 'creators'
        database = $MONGO_DATABASE
        dataSource = $MONGO_CLUSTER
        filter = @{}
        limit = 1
    } | ConvertTo-Json
    
    Write-Host "Testing direct MongoDB Data API access..." -ForegroundColor Yellow
    $mongoResponse = Invoke-WebRequest -Uri $mongoApiUrl -Method POST -Headers $mongoHeaders -Body $mongoBody -UseBasicParsing
    $mongoData = $mongoResponse.Content | ConvertFrom-Json
    
    if ($mongoResponse.StatusCode -eq 200) {
        Write-Host "  [PASS] Direct MongoDB access working" -ForegroundColor Green
        Write-Host "  Documents found: $($mongoData.documents.Count)" -ForegroundColor Gray
    } else {
        Write-Host "  [FAIL] Direct MongoDB access failed" -ForegroundColor Red
    }
    
} catch {
    Write-Host "  [FAIL] Direct MongoDB test failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Check if it's an authentication error
    if ($_.Exception.Message -match "401" -or $_.Exception.Message -match "Unauthorized") {
        Write-Host ""
        Write-Host "Authentication Error Detected!" -ForegroundColor Red
        Write-Host "This suggests that the MongoDB Data API credentials are not properly configured." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To fix this:" -ForegroundColor White
        Write-Host "1. Go to MongoDB Atlas (https://cloud.mongodb.com)" -ForegroundColor White
        Write-Host "2. Navigate to your project > Data API" -ForegroundColor White
        Write-Host "3. Create or verify your Data API configuration" -ForegroundColor White
        Write-Host "4. Update MONGO_APP_ID and MONGO_API_KEY in deploy-config.ps1" -ForegroundColor White
    }
}

# Configuration Validation
Write-Host ""
Write-Host "=== Configuration Validation ===" -ForegroundColor Cyan

$configIssues = @()

if (-not $MONGO_APP_ID -or $MONGO_APP_ID -eq "your_mongo_app_id") {
    $configIssues += "MONGO_APP_ID not configured"
}

if (-not $MONGO_API_KEY -or $MONGO_API_KEY -eq "your_mongo_api_key") {
    $configIssues += "MONGO_API_KEY not configured"
}

if (-not $MONGO_DATABASE -or $MONGO_DATABASE -eq "creatorino") {
    Write-Host "Using default database name: $MONGO_DATABASE" -ForegroundColor Yellow
}

if (-not $MONGO_CLUSTER) {
    $configIssues += "MONGO_CLUSTER not configured"
}

if ($configIssues.Count -gt 0) {
    Write-Host "Configuration Issues Found:" -ForegroundColor Red
    $configIssues | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
} else {
    Write-Host "All MongoDB configuration values are set" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "=== MongoDB Test Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $($mongoTests.Passed)" -ForegroundColor Green
Write-Host "Failed: $($mongoTests.Failed)" -ForegroundColor Red

if ($mongoTests.Failed -gt 0) {
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $mongoTests.Details | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Common MongoDB Issues:" -ForegroundColor Yellow
    Write-Host "1. MongoDB Data API not enabled in Atlas" -ForegroundColor White
    Write-Host "2. Incorrect App ID or API Key" -ForegroundColor White
    Write-Host "3. Database or collection doesn't exist" -ForegroundColor White
    Write-Host "4. Network connectivity issues" -ForegroundColor White
    Write-Host "5. MongoDB Atlas cluster not running" -ForegroundColor White
}

# Save detailed results
$reportPath = ".\mongodb-test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$mongoTests | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host ""
Write-Host "Detailed MongoDB test report saved to: $reportPath" -ForegroundColor Blue
