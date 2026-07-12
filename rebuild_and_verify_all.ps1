# Run rebuild_clean.ps1
& ./rebuild_clean.ps1

Write-Host "`n=== Checking index.html file size & structure ==="
$item = Get-Item "index.html"
Write-Host "index.html Size: $($item.Length) bytes"

# Run check_true_moji.ps1
& ./check_true_moji.ps1

# Create test page to verify Chrome execution without any syntax errors
$testDebugHtml = [System.IO.File]::ReadAllText("test_chrome_debug.html", [System.Text.Encoding]::UTF8)
# We will make sure test_chrome_debug.html is updated with the latest app.js and style.css
& ./create_chrome_debug_page.ps1

Write-Host "`n=== Running Headless Chrome Diagnostic on updated test_chrome_debug.html ==="
& 'C:\Program Files\Google\Chrome\Application\chrome.exe' --headless=new --virtual-time-budget=4000 --dump-dom file:///c:/Users/Anuskar/Downloads/ai-practice/ml-exam-portal/test_chrome_debug.html | Select-String -Pattern 'debug-log-output' -Context 0,15
