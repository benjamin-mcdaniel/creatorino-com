# Comprehensive API Testing Script for Creatorino
# Tests MongoDB, YouTube, and Twitch integrations

param(
    [string]$ApiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev",
    [switch]$Verbose = $false
)

# Import configuration
. .\deploy-config.ps1

Write-Host "=== Creatorino API Test Suite ===" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Green
Write-Host ""

$global:TestResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [scriptblock]$Validator = { $true }
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        if ($Verbose) {
            Write-Host "  Response: $($response.StatusCode)" -ForegroundColor Gray
            Write-Host "  Content: $($content | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        }
        
        $isValid = & $Validator $response $content
        
        if ($isValid) {
            Write-Host "  [PASS]" -ForegroundColor Green
            $global:TestResults.Passed++
        } else {
            Write-Host "  [FAIL] Validation failed" -ForegroundColor Red
            $global:TestResults.Failed++
        }
        
        $global:TestResults.Tests += @{
            Name = $Name
            Status = if ($isValid) { "PASS" } else { "FAIL" }
            Response = $response
            Content = $content
        }
        
    } catch {
        Write-Host "  [FAIL] Error: $($_.Exception.Message)" -ForegroundColor Red
        $global:TestResults.Failed++
        $global:TestResults.Tests += @{
            Name = $Name
            Status = "FAIL"
            Error = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

# Test 1: Basic Health Check
Test-Endpoint -Name "Health Check" -Url "$ApiUrl/health" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and $content.status -eq "ok"
}

# Test 2: CORS Headers
Test-Endpoint -Name "CORS Headers" -Url "$ApiUrl/health" -Method "OPTIONS" -Validator {
    param($response, $content)
    $headers = $response.Headers
    return $headers["Access-Control-Allow-Origin"] -eq "*" -and 
           $headers["Access-Control-Allow-Methods"] -match "GET" -and
           $headers["Access-Control-Allow-Headers"] -match "Content-Type"
}

# Test 3: Live Search (MongoDB Cache)
Test-Endpoint -Name "Live Search - Empty Query" -Url "$ApiUrl/api/search/live?q=" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and $content.creators -is [Array]
}

Test-Endpoint -Name "Live Search - Test Query" -Url "$ApiUrl/api/search/live?q=test&limit=5" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.creators -is [Array]
}

# Test 4: Advanced Search (YouTube + Twitch APIs)
Test-Endpoint -Name "Advanced Search - Popular Term" -Url "$ApiUrl/api/search/advanced?q=gaming&limit=5" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.results -is [Array]
}

Test-Endpoint -Name "Advanced Search - Specific Creator" -Url "$ApiUrl/api/search/advanced?q=pewdiepie&limit=3" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.results -is [Array] -and
           (($content.results.Count -eq 0) -or ($content.results[0].platform -in @("youtube", "twitch")))
}

# Test 5: Creator Profile Endpoints
Test-Endpoint -Name "Creator Profile - YouTube" -Url "$ApiUrl/api/creator/youtube/UC-lHJZR3Gqxm24_Vd_AJ5Yw" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.creator.platform -eq "youtube" -and
           $content.creator.PSObject.Properties.Name -contains "id"
}

Test-Endpoint -Name "Creator Profile - Twitch" -Url "$ApiUrl/api/creator/twitch/ninja" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.creator.platform -eq "twitch" -and
           $content.creator.PSObject.Properties.Name -contains "id"
}

# Test 6: Database Operations
Test-Endpoint -Name "Database Health Check" -Url "$ApiUrl/api/db/status" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "connected" -and
           $content.PSObject.Properties.Name -contains "database"
}

# Test 7: API Keys Validation
Test-Endpoint -Name "YouTube API Status" -Url "$ApiUrl/api/status/youtube" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "quotaUsage"
}

Test-Endpoint -Name "Twitch API Status" -Url "$ApiUrl/api/status/twitch" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and 
           $content.PSObject.Properties.Name -contains "tokenValid"
}

# Test 8: Error Handling
Test-Endpoint -Name "Invalid Endpoint" -Url "$ApiUrl/api/nonexistent" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 200 -and $content.message -eq "Creatorino API"
}

Test-Endpoint -Name "Invalid Creator ID" -Url "$ApiUrl/api/creator/youtube/invalid-id-12345" -Validator {
    param($response, $content)
    return $response.StatusCode -eq 404 -or ($response.StatusCode -eq 200 -and $content.error)
}

# Summary
Write-Host "=== Test Results Summary ===" -ForegroundColor Cyan
Write-Host "Passed: $($global:TestResults.Passed)" -ForegroundColor Green
Write-Host "Failed: $($global:TestResults.Failed)" -ForegroundColor Red
Write-Host "Total:  $($global:TestResults.Passed + $global:TestResults.Failed)" -ForegroundColor White

if ($global:TestResults.Failed -gt 0) {
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor Red
    $global:TestResults.Tests | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
        if ($_.Error) {
            Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
        }
    }
}

# Generate detailed report
$reportPath = ".\test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$global:TestResults | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host ""
Write-Host "Detailed report saved to: $reportPath" -ForegroundColor Blue

# Return exit code
if ($global:TestResults.Failed -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Some tests failed. Check the report for details." -ForegroundColor Red
    exit 1
}
