$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Find what happens inside DOMContentLoaded listener
$start = $js.IndexOf("document.addEventListener('DOMContentLoaded'")
if ($start -ge 0) {
    $sub = $js.Substring($start, [Math]::Min(1500, $js.Length - $start))
    Write-Host "--- DOMContentLoaded handler ---"
    Write-Host $sub
} else {
    Write-Host "DOMContentLoaded listener not found!"
}
