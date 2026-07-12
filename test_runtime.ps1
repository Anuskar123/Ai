Add-Type -AssemblyName System.Windows.Forms
$wb = New-Object System.Windows.Forms.WebBrowser
$wb.ScriptErrorsSuppressed = $false

# Event handler for JS errors
$errors = @()
$wb.add_DocumentCompleted({
    Write-Host "Document completed loading."
    try {
        # Let's invoke switchTabSection('test-1') to see if it throws an error
        $wb.Document.InvokeScript("switchTabSection", @("test-1"))
        Write-Host "Invoked switchTabSection('test-1') successfully."
        
        # Check if test1 cards rendered
        $cards = $wb.Document.GetElementById("test1-questions-container")
        if ($cards) {
            Write-Host "test1-questions-container innerHTML length: $($cards.InnerHtml.Length)"
        } else {
            Write-Host "test1-questions-container element not found!"
        }
    } catch {
        Write-Host "JS Execution error: $_"
    }
})

$uri = New-Object System.Uri("file:///c:/Users/Anuskar/Downloads/ai-practice/ml-exam-portal/index.html")
$wb.Navigate($uri)

# Pump messages for 3 seconds
$t0 = [DateTime]::Now
while (([DateTime]::Now - $t0).TotalSeconds -lt 3) {
    [System.Windows.Forms.Application]::DoEvents()
    Start-Sleep -Milliseconds 50
}
