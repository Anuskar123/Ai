$content = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$lines = $content -split "`r?`n"
Write-Host "Matches in csy3081_external.html:"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'â|•|&bull;|\b\d{2}:\d{2}\b|\[\d{1,2}:\d{2}|card-time|time-badge|(`\b\d+ Qs`)|(`\b\d+ Demos`)|\(`00:00') {
        Write-Host "Line $($i+1): $($lines[$i].Trim())"
    }
}
