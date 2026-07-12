Add-Type -AssemblyName System.Windows.Forms
$wb = New-Object System.Windows.Forms.WebBrowser
$wb.ScriptErrorsSuppressed = $false

$wb.add_DocumentCompleted({
    $wb.Document.InvokeScript("switchTabSection", @("test-1"))
    $c = $wb.Document.GetElementById("test1-questions-container")
    if ($c) {
        Write-Host "Container InnerHTML: '$($c.InnerHtml)'"
    }
    # Also let's check if window.test1Questions is defined and how many items
    $count = $wb.Document.InvokeScript("eval", @("window.test1Questions ? window.test1Questions.length : 'undefined'"))
    Write-Host "window.test1Questions count: $count"
    
    # Check what error happened inside renderTest1Questions
    $err = $wb.Document.InvokeScript("eval", @("window._lastRenderError || 'no error'"))
    Write-Host "Last render error: $err"
})

$uri = New-Object System.Uri("file:///c:/Users/Anuskar/Downloads/ai-practice/ml-exam-portal/index.html")
$wb.Navigate($uri)

$t0 = [DateTime]::Now
while (([DateTime]::Now - $t0).TotalSeconds -lt 3) {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 50
}
