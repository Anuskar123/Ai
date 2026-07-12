$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$lines = $js -split '`r?`n'
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "window\.switchTabSection") {
        Write-Host "Line $($i + 1): $($lines[$i])"
    }
}
Write-Host "Total lines in app.js: $($lines.Length)"
