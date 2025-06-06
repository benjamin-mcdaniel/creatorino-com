# Frontend-Backend Connectivity Test
# Tests if the React frontend can properly communicate with the Cloudflare Workers backend

param(
    [string]$FrontendUrl = "https://creatorino-frontend.pages.dev",
    [string]$ApiUrl = "https://creatorino-api.benjamin-f-mcdaniel.workers.dev"
)

Write-Host "=== Frontend-Backend Connectivity Test ===" -ForegroundColor Cyan
Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Green
Write-Host "Expected API URL: $ApiUrl" -ForegroundColor Green
Write-Host ""

$testResults = @{
    FrontendAccessible = $false
    ApiUrlEmbedded = $false
    CorsWorking = $false
    LiveSearchWorking = $false
    AdvancedSearchWorking = $false
}

# Test 1: Check if frontend is accessible
Write-Host "1. Testing frontend accessibility..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri $FrontendUrl -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   [PASS] Frontend is accessible" -ForegroundColor Green
        $testResults.FrontendAccessible = $true
        
        # Check if API URL is embedded in the frontend code
        if ($frontendResponse.Content -match [regex]::Escape($ApiUrl)) {
            Write-Host "   [PASS] API URL is embedded in frontend" -ForegroundColor Green
            $testResults.ApiUrlEmbedded = $true
        } else {
            Write-Host "   [FAIL] API URL not found in frontend code" -ForegroundColor Red
            Write-Host "   Expected: $ApiUrl" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   [FAIL] Frontend not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test CORS from browser perspective
Write-Host ""
Write-Host "2. Testing CORS configuration..." -ForegroundColor Yellow
try {
    $corsHeaders = @{
        'Origin' = $FrontendUrl
        'Access-Control-Request-Method' = 'GET'
        'Access-Control-Request-Headers' = 'Content-Type'
    }
    
    $corsResponse = Invoke-WebRequest -Uri "$ApiUrl/health" -Method OPTIONS -Headers $corsHeaders -UseBasicParsing
    $allowOrigin = $corsResponse.Headers['Access-Control-Allow-Origin']
    
    if ($allowOrigin -eq "*" -or $allowOrigin -eq $FrontendUrl) {
        Write-Host "   [PASS] CORS properly configured" -ForegroundColor Green
        $testResults.CorsWorking = $true
    } else {
        Write-Host "   [FAIL] CORS misconfigured. Allow-Origin: $allowOrigin" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] CORS test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Simulate frontend live search call
Write-Host ""
Write-Host "3. Testing live search API call..." -ForegroundColor Yellow
try {
    $liveSearchUrl = "$ApiUrl/api/search/live?q=test&limit=10"
    $liveSearchHeaders = @{
        'Origin' = $FrontendUrl
        'Referer' = $FrontendUrl
    }
    
    $liveResponse = Invoke-WebRequest -Uri $liveSearchUrl -Headers $liveSearchHeaders -UseBasicParsing
    $liveData = $liveResponse.Content | ConvertFrom-Json
    
    if ($liveResponse.StatusCode -eq 200 -and $liveData.creators -is [Array]) {
        Write-Host "   [PASS] Live search working" -ForegroundColor Green
        Write-Host "   Results: $($liveData.creators.Count) creators found" -ForegroundColor Gray
        $testResults.LiveSearchWorking = $true
    } else {
        Write-Host "   [FAIL] Live search returned unexpected response" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] Live search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Simulate frontend advanced search call
Write-Host ""
Write-Host "4. Testing advanced search API call..." -ForegroundColor Yellow
try {
    $advancedSearchUrl = "$ApiUrl/api/search/advanced?q=gaming&limit=5"
    $advancedSearchHeaders = @{
        'Origin' = $FrontendUrl
        'Referer' = $FrontendUrl
    }
    
    $advancedResponse = Invoke-WebRequest -Uri $advancedSearchUrl -Headers $advancedSearchHeaders -UseBasicParsing
    $advancedData = $advancedResponse.Content | ConvertFrom-Json
    
    if ($advancedResponse.StatusCode -eq 200 -and $advancedData.results -is [Array]) {
        Write-Host "   [PASS] Advanced search working" -ForegroundColor Green
        Write-Host "   Results: $($advancedData.results.Count) creators found" -ForegroundColor Gray
        $testResults.AdvancedSearchWorking = $true
    } else {
        Write-Host "   [FAIL] Advanced search returned unexpected response" -ForegroundColor Red
    }
} catch {
    Write-Host "   [FAIL] Advanced search failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Check browser console for errors (simulated)
Write-Host ""
Write-Host "5. Browser compatibility check..." -ForegroundColor Yellow

# Create a simple HTML test page to check for JavaScript errors
$testHtml = @"
<!DOCTYPE html>
<html>
<head>
    <title>API Test</title>
</head>
<body>
    <script>
        const API_BASE = '$ApiUrl';
        
        async function testApiCall() {
            try {
                const response = await fetch(API_BASE + '/health');
                const data = await response.json();
                console.log('API Test Success:', data);
                return true;
            } catch (error) {
                console.error('API Test Failed:', error);
                return false;
            }
        }
        
        testApiCall().then(success => {
            document.body.innerHTML = success ? 
                '<h1 style="color: green;">API Connection: SUCCESS</h1>' : 
                '<h1 style="color: red;">API Connection: FAILED</h1>';
        });
    </script>
</body>
</html>
"@

$testHtmlPath = ".\api-connectivity-test.html"
$testHtml | Out-File -FilePath $testHtmlPath -Encoding UTF8
Write-Host "   Created browser test file: $testHtmlPath" -ForegroundColor Blue
Write-Host "   Open this file in a browser to test JavaScript API calls" -ForegroundColor Blue

# Summary
Write-Host ""
Write-Host "=== Frontend-Backend Connectivity Summary ===" -ForegroundColor Cyan
Write-Host "Frontend Accessible:     $($testResults.FrontendAccessible)" -ForegroundColor $(if($testResults.FrontendAccessible){"Green"}else{"Red"})
Write-Host "API URL Embedded:        $($testResults.ApiUrlEmbedded)" -ForegroundColor $(if($testResults.ApiUrlEmbedded){"Green"}else{"Red"})
Write-Host "CORS Working:            $($testResults.CorsWorking)" -ForegroundColor $(if($testResults.CorsWorking){"Green"}else{"Red"})
Write-Host "Live Search Working:     $($testResults.LiveSearchWorking)" -ForegroundColor $(if($testResults.LiveSearchWorking){"Green"}else{"Red"})
Write-Host "Advanced Search Working: $($testResults.AdvancedSearchWorking)" -ForegroundColor $(if($testResults.AdvancedSearchWorking){"Green"}else{"Red"})

$allPassed = $testResults.Values | ForEach-Object { $_ } | Where-Object { $_ -eq $false } | Measure-Object | Select-Object -ExpandProperty Count
if ($allPassed -eq 0) {
    Write-Host ""
    Write-Host "All connectivity tests passed! Frontend should be working correctly." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Some connectivity issues detected. Check the failed tests above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "- Ensure API is deployed and running" -ForegroundColor White
    Write-Host "- Check CORS configuration in API" -ForegroundColor White
    Write-Host "- Verify API URL is correctly embedded in frontend build" -ForegroundColor White
    Write-Host "- Check MongoDB and API key configuration" -ForegroundColor White
}

# Save results
$testResults | ConvertTo-Json | Out-File -FilePath ".\connectivity-test-results.json" -Encoding UTF8
