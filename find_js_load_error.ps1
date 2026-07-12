Add-Type -AssemblyName System.Windows.Forms
$wb = New-Object System.Windows.Forms.WebBrowser
$wb.ScriptErrorsSuppressed = $false

# Let's create an HTML page that attaches window.onerror BEFORE loading app.js
$testHtml = @'
<!DOCTYPE html>
<html>
<head>
<script>
window.jsErrors = [];
window.onerror = function(msg, url, line, col, error) {
    window.jsErrors.push("Line " + line + ":" + col + " - " + msg);
    return true;
};
</script>
</head>
<body>
<div id="test1-questions-container"><p style="text-align: center; color: var(--text-muted)">Loading Test 1 Questions...</p></div>
<script src="app.js"></script>
</body>
</html>
'@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test_js_errors.html", $testHtml, $utf8NoBom)

$wb.add_DocumentCompleted({
    $errors = $wb.Document.InvokeScript("eval", @("window.jsErrors.join('\n')"))
    Write-Host "JS Errors trapped on load:"
    Write-Host $errors
    
    $test1Def = $wb.Document.InvokeScript("eval", @("typeof window.test1Questions"))
    Write-Host "typeof window.test1Questions: $test1Def"
})

$uri = New-Object System.Uri("file:///c:/Users/Anuskar/Downloads/ai-practice/ml-exam-portal/test_js_errors.html")
$wb.Navigate($uri)

$t0 = [DateTime]::Now
while (([DateTime]::Now - $t0).TotalSeconds -lt 3) {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 50
}
