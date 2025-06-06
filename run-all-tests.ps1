# Master Test Runner for Creatorino Platform
# Runs all comprehensive tests and generates a complete report

param(
    [switch]$SkipMongo = $false,
    [switch]$SkipApis = $false,
    [switch]$SkipConnectivity = $false,
    [switch]$Verbose = $false,
    [string]$ReportFormat = "console" # Options: console, json, html
)

$ErrorActionPreference = "Continue"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "    Creatorino Platform Test Suite" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date
$allResults = @{
    StartTime = $startTime
    TestSuites = @()
    Summary = @{
        TotalPassed = 0
        TotalFailed = 0
        TotalSkipped = 0
    }
}

function Run-TestSuite {
    param(
        [string]$Name,
        [string]$ScriptPath,
        [hashtable]$Parameters = @{},
        [bool]$Skip = $false
    )
    
    Write-Host "=== Running $Name ===" -ForegroundColor Magenta
    
    if ($Skip) {
        Write-Host "SKIPPED: $Name" -ForegroundColor Yellow
        $allResults.TestSuites += @{
            Name = $Name
            Status = "SKIPPED"
            Duration = 0
        }
        $allResults.Summary.TotalSkipped++
        return
    }
    
    $suiteStartTime = Get-Date
    
    try {
        if ($Parameters.Count -gt 0) {
            $paramString = ($Parameters.GetEnumerator() | ForEach-Object { "-$($_.Key) $($_.Value)" }) -join " "
            $result = & $ScriptPath @Parameters
        } else {
            $result = & $ScriptPath
        }
        
        $suiteEndTime = Get-Date
        $duration = ($suiteEndTime - $suiteStartTime).TotalSeconds
        
        # Parse exit code or assume success if script completes
        $status = if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) { "PASSED" } else { "FAILED" }
        
        $allResults.TestSuites += @{
            Name = $Name
            Status = $status
            Duration = $duration
            Details = $result
        }
        
        if ($status -eq "PASSED") {
            $allResults.Summary.TotalPassed++
            Write-Host "COMPLETED: $Name ($([math]::Round($duration, 2))s)" -ForegroundColor Green
        } else {
            $allResults.Summary.TotalFailed++
            Write-Host "FAILED: $Name ($([math]::Round($duration, 2))s)" -ForegroundColor Red
        }
        
    } catch {
        $suiteEndTime = Get-Date
        $duration = ($suiteEndTime - $suiteStartTime).TotalSeconds
        
        Write-Host "ERROR: $Name - $($_.Exception.Message)" -ForegroundColor Red
        
        $allResults.TestSuites += @{
            Name = $Name
            Status = "ERROR"
            Duration = $duration
            Error = $_.Exception.Message
        }
        $allResults.Summary.TotalFailed++
    }
    
    Write-Host ""
}

# Check if test scripts exist
$testScripts = @{
    "Basic API Tests" = ".\test-api.ps1"
    "MongoDB Integration" = ".\test-mongodb.ps1"
    "External APIs (YouTube/Twitch)" = ".\test-external-apis.ps1"
    "Frontend Connectivity" = ".\test-frontend-connectivity.ps1"
}

$missingScripts = @()
foreach ($script in $testScripts.Values) {
    if (-not (Test-Path $script)) {
        $missingScripts += $script
    }
}

if ($missingScripts.Count -gt 0) {
    Write-Host "Missing test scripts:" -ForegroundColor Red
    $missingScripts | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please ensure all test scripts are present before running the master test suite." -ForegroundColor Yellow
    exit 1
}

# Run test suites
$verboseParam = if ($Verbose) { @{ Verbose = $true } } else { @{} }

Run-TestSuite -Name "Basic API Tests" -ScriptPath $testScripts["Basic API Tests"] -Parameters $verboseParam

Run-TestSuite -Name "MongoDB Integration" -ScriptPath $testScripts["MongoDB Integration"] -Skip $SkipMongo

Run-TestSuite -Name "External APIs (YouTube/Twitch)" -ScriptPath $testScripts["External APIs (YouTube/Twitch)"] -Skip $SkipApis

Run-TestSuite -Name "Frontend Connectivity" -ScriptPath $testScripts["Frontend Connectivity"] -Skip $SkipConnectivity

# Calculate total duration
$endTime = Get-Date
$totalDuration = ($endTime - $startTime).TotalSeconds
$allResults.EndTime = $endTime
$allResults.TotalDuration = $totalDuration

# Generate summary report
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "           TEST SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Total Duration: $([math]::Round($totalDuration, 2)) seconds" -ForegroundColor White
Write-Host "Passed:  $($allResults.Summary.TotalPassed)" -ForegroundColor Green
Write-Host "Failed:  $($allResults.Summary.TotalFailed)" -ForegroundColor Red
Write-Host "Skipped: $($allResults.Summary.TotalSkipped)" -ForegroundColor Yellow
Write-Host ""

# Detailed results
Write-Host "Test Suite Results:" -ForegroundColor White
$allResults.TestSuites | ForEach-Object {
    $color = switch ($_.Status) {
        "PASSED" { "Green" }
        "FAILED" { "Red" }
        "ERROR" { "Red" }
        "SKIPPED" { "Yellow" }
        default { "White" }
    }
    Write-Host "  $($_.Name): $($_.Status) ($([math]::Round($_.Duration, 2))s)" -ForegroundColor $color
}

# Recommendations based on results
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "         RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

$failedSuites = $allResults.TestSuites | Where-Object { $_.Status -in @("FAILED", "ERROR") }

if ($failedSuites.Count -eq 0) {
    Write-Host "Excellent! All tests passed." -ForegroundColor Green
    Write-Host "Your Creatorino platform appears to be working correctly." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Test the frontend manually at https://creatorino-frontend.pages.dev" -ForegroundColor White
    Write-Host "2. Perform some live searches to verify end-to-end functionality" -ForegroundColor White
    Write-Host "3. Monitor API usage and performance" -ForegroundColor White
} else {
    Write-Host "Issues detected in the following areas:" -ForegroundColor Red
    $failedSuites | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Priority fixes:" -ForegroundColor Yellow
    
    # Specific recommendations based on failed tests
    if ($failedSuites | Where-Object { $_.Name -match "MongoDB" }) {
        Write-Host "1. MongoDB Issues:" -ForegroundColor White
        Write-Host "   - Check MongoDB Atlas Data API configuration" -ForegroundColor Gray
        Write-Host "   - Verify MONGO_APP_ID and MONGO_API_KEY in deploy-config.ps1" -ForegroundColor Gray
        Write-Host "   - Ensure MongoDB cluster is running" -ForegroundColor Gray
    }
    
    if ($failedSuites | Where-Object { $_.Name -match "External APIs" }) {
        Write-Host "2. External API Issues:" -ForegroundColor White
        Write-Host "   - Verify YouTube API key permissions" -ForegroundColor Gray
        Write-Host "   - Check Twitch Client ID and Secret" -ForegroundColor Gray
        Write-Host "   - Monitor API quotas and rate limits" -ForegroundColor Gray
    }
    
    if ($failedSuites | Where-Object { $_.Name -match "Frontend" }) {
        Write-Host "3. Frontend Connectivity Issues:" -ForegroundColor White
        Write-Host "   - Check CORS configuration" -ForegroundColor Gray
        Write-Host "   - Verify API URL is correctly embedded in frontend" -ForegroundColor Gray
        Write-Host "   - Test with browser developer tools" -ForegroundColor Gray
    }
    
    if ($failedSuites | Where-Object { $_.Name -match "Basic API" }) {
        Write-Host "4. Basic API Issues:" -ForegroundColor White
        Write-Host "   - Check if Cloudflare Worker is deployed and running" -ForegroundColor Gray
        Write-Host "   - Verify environment variables in Worker" -ForegroundColor Gray
        Write-Host "   - Review Worker logs in Cloudflare dashboard" -ForegroundColor Gray
    }
}

# Generate report files
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$baseReportPath = ".\test-results-$timestamp"

# JSON Report
$jsonReportPath = "$baseReportPath.json"
$allResults | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonReportPath -Encoding UTF8
Write-Host ""
Write-Host "Detailed JSON report saved to: $jsonReportPath" -ForegroundColor Blue

# HTML Report (if requested)
if ($ReportFormat -eq "html") {
    $htmlReportPath = "$baseReportPath.html"
    $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>Creatorino Test Results - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { color: #2e86c1; }
        .pass { color: #27ae60; }
        .fail { color: #e74c3c; }
        .skip { color: #f39c12; }
        .suite { margin: 10px 0; padding: 10px; border-left: 4px solid #bdc3c7; }
        .suite.pass { border-left-color: #27ae60; }
        .suite.fail { border-left-color: #e74c3c; }
        .suite.skip { border-left-color: #f39c12; }
        .summary { background: #ecf0f1; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1 class="header">Creatorino Platform Test Results</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Duration:</strong> $([math]::Round($totalDuration, 2)) seconds</p>
        <p><span class="pass">Passed: $($allResults.Summary.TotalPassed)</span> | 
           <span class="fail">Failed: $($allResults.Summary.TotalFailed)</span> | 
           <span class="skip">Skipped: $($allResults.Summary.TotalSkipped)</span></p>
    </div>
    
    <h2>Test Suite Details</h2>
"@

    $allResults.TestSuites | ForEach-Object {
        $cssClass = switch ($_.Status) {
            "PASSED" { "pass" }
            "FAILED" { "fail" }
            "ERROR" { "fail" }
            "SKIPPED" { "skip" }
        }
        
        $htmlContent += @"
    <div class="suite $cssClass">
        <h3>$($_.Name)</h3>
        <p><strong>Status:</strong> $($_.Status)</p>
        <p><strong>Duration:</strong> $([math]::Round($_.Duration, 2)) seconds</p>
"@
        if ($_.Error) {
            $htmlContent += "<p><strong>Error:</strong> $($_.Error)</p>"
        }
        $htmlContent += "</div>"
    }

    $htmlContent += @"
    
    <h2>Recommendations</h2>
    <p>For detailed recommendations and next steps, please refer to the console output or JSON report.</p>
    
    <footer>
        <p><small>Generated on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</small></p>
    </footer>
</body>
</html>
"@

    $htmlContent | Out-File -FilePath $htmlReportPath -Encoding UTF8
    Write-Host "HTML report saved to: $htmlReportPath" -ForegroundColor Blue
}

Write-Host ""
Write-Host "Test suite completed. Use the reports above for detailed analysis." -ForegroundColor Cyan

# Exit with appropriate code
if ($allResults.Summary.TotalFailed -eq 0) {
    exit 0
} else {
    exit 1
}
