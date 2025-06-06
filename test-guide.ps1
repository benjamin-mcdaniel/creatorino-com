# Creatorino Testing Guide
# Complete guide to testing your platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Creatorino Platform Testing Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This guide will help you test your Creatorino platform comprehensively." -ForegroundColor White
Write-Host ""

Write-Host "Available Test Scripts:" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Quick Diagnostic (Recommended First)" -ForegroundColor Green
Write-Host "   Command: .\quick-diagnostic.ps1" -ForegroundColor White
Write-Host "   Purpose: Rapid check of common issues" -ForegroundColor Gray
Write-Host "   Time: ~30 seconds" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Full Test Suite" -ForegroundColor Green
Write-Host "   Command: .\run-all-tests.ps1" -ForegroundColor White
Write-Host "   Purpose: Comprehensive testing of all components" -ForegroundColor Gray
Write-Host "   Time: ~2-3 minutes" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Individual Test Scripts" -ForegroundColor Green
Write-Host "   a) Basic API Tests:" -ForegroundColor White
Write-Host "      Command: .\test-api.ps1" -ForegroundColor White
Write-Host "      Purpose: Tests core API functionality" -ForegroundColor Gray
Write-Host ""
Write-Host "   b) MongoDB Integration:" -ForegroundColor White
Write-Host "      Command: .\test-mongodb.ps1" -ForegroundColor White
Write-Host "      Purpose: Tests database connectivity and operations" -ForegroundColor Gray
Write-Host ""
Write-Host "   c) External APIs (YouTube/Twitch):" -ForegroundColor White
Write-Host "      Command: .\test-external-apis.ps1" -ForegroundColor White
Write-Host "      Purpose: Tests third-party API integrations" -ForegroundColor Gray
Write-Host ""
Write-Host "   d) Frontend Connectivity:" -ForegroundColor White
Write-Host "      Command: .\test-frontend-connectivity.ps1" -ForegroundColor White
Write-Host "      Purpose: Tests frontend-backend communication" -ForegroundColor Gray
Write-Host ""

Write-Host "Test Options:" -ForegroundColor Yellow
Write-Host "-------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "Most scripts support these parameters:" -ForegroundColor White
Write-Host "  -Verbose          Show detailed output" -ForegroundColor Gray
Write-Host "  -ApiUrl <url>     Override API URL for testing" -ForegroundColor Gray
Write-Host ""

Write-Host "Full test suite options:" -ForegroundColor White
Write-Host "  -SkipMongo        Skip MongoDB tests" -ForegroundColor Gray
Write-Host "  -SkipApis         Skip external API tests" -ForegroundColor Gray
Write-Host "  -SkipConnectivity Skip frontend connectivity tests" -ForegroundColor Gray
Write-Host "  -ReportFormat     'console', 'json', or 'html'" -ForegroundColor Gray
Write-Host ""

Write-Host "Recommended Testing Workflow:" -ForegroundColor Yellow
Write-Host "-----------------------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Start with Quick Diagnostic" -ForegroundColor Green
Write-Host "   .\quick-diagnostic.ps1" -ForegroundColor White
Write-Host "   This will identify major configuration issues quickly." -ForegroundColor Gray
Write-Host ""

Write-Host "2. If issues are found, fix them and redeploy:" -ForegroundColor Green
Write-Host "   - Fix configuration in deploy-config.ps1" -ForegroundColor White
Write-Host "   - Redeploy: .\deploy-unified.ps1" -ForegroundColor White
Write-Host "   - Re-run diagnostic" -ForegroundColor White
Write-Host ""

Write-Host "3. Run the full test suite:" -ForegroundColor Green
Write-Host "   .\run-all-tests.ps1 -ReportFormat html" -ForegroundColor White
Write-Host "   This will generate a comprehensive HTML report." -ForegroundColor Gray
Write-Host ""

Write-Host "4. Manual testing:" -ForegroundColor Green
Write-Host "   - Open https://creatorino-frontend.pages.dev" -ForegroundColor White
Write-Host "   - Try searching for 'gaming'" -ForegroundColor White
Write-Host "   - Click on creator profiles" -ForegroundColor White
Write-Host "   - Check browser console for errors (F12)" -ForegroundColor White
Write-Host ""

Write-Host "Common Issues and Solutions:" -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "MongoDB Connection Issues:" -ForegroundColor Red
Write-Host "  Problem: MongoDB tests failing" -ForegroundColor White
Write-Host "  Solution: Check MongoDB Atlas Data API configuration" -ForegroundColor Gray
Write-Host "           Update MONGO_APP_ID and MONGO_API_KEY" -ForegroundColor Gray
Write-Host ""

Write-Host "API Key Issues:" -ForegroundColor Red
Write-Host "  Problem: YouTube/Twitch tests failing" -ForegroundColor White
Write-Host "  Solution: Verify API keys in deploy-config.ps1" -ForegroundColor Gray
Write-Host "           Check quota limits and permissions" -ForegroundColor Gray
Write-Host ""

Write-Host "CORS Issues:" -ForegroundColor Red
Write-Host "  Problem: Frontend can't connect to API" -ForegroundColor White
Write-Host "  Solution: Check CORS headers in API responses" -ForegroundColor Gray
Write-Host "           Verify API URL is embedded in frontend" -ForegroundColor Gray
Write-Host ""

Write-Host "Deployment Issues:" -ForegroundColor Red
Write-Host "  Problem: Services not accessible" -ForegroundColor White
Write-Host "  Solution: Check Cloudflare dashboard" -ForegroundColor Gray
Write-Host "           Re-run deployment scripts" -ForegroundColor Gray
Write-Host ""

Write-Host "Troubleshooting Commands:" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "Check API status directly:" -ForegroundColor White
Write-Host '  curl https://creatorino-api.benjamin-f-mcdaniel.workers.dev/health' -ForegroundColor Gray
Write-Host ""

Write-Host "Check frontend accessibility:" -ForegroundColor White
Write-Host '  curl https://creatorino-frontend.pages.dev' -ForegroundColor Gray
Write-Host ""

Write-Host "Test API from frontend origin:" -ForegroundColor White
Write-Host '  curl -H "Origin: https://creatorino-frontend.pages.dev" https://creatorino-api.benjamin-f-mcdaniel.workers.dev/health' -ForegroundColor Gray
Write-Host ""

Write-Host "Generated Files:" -ForegroundColor Yellow
Write-Host "---------------" -ForegroundColor Yellow
Write-Host ""

Write-Host "Test scripts will generate several files:" -ForegroundColor White
Write-Host "  - test-results-*.json           Detailed test results" -ForegroundColor Gray
Write-Host "  - test-results-*.html           HTML test report" -ForegroundColor Gray
Write-Host "  - connectivity-test-results.json Frontend connectivity results" -ForegroundColor Gray
Write-Host "  - mongodb-test-results-*.json   MongoDB specific results" -ForegroundColor Gray
Write-Host "  - external-api-test-results-*.json External API results" -ForegroundColor Gray
Write-Host "  - api-connectivity-test.html    Browser-based API test" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to Start Testing?" -ForegroundColor Cyan
Write-Host "----------------------" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Would you like to run the Quick Diagnostic now? (y/n)"

if ($choice -eq 'y' -or $choice -eq 'Y') {
    Write-Host ""
    Write-Host "Running Quick Diagnostic..." -ForegroundColor Green
    & .\quick-diagnostic.ps1
} else {
    Write-Host ""
    Write-Host "You can run any of the test scripts manually when ready." -ForegroundColor White
    Write-Host "Start with: .\quick-diagnostic.ps1" -ForegroundColor Green
}

Write-Host ""
Write-Host "Testing guide complete!" -ForegroundColor Cyan
