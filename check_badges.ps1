$content = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$lines = $content -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'card-time|time-badge|badge.*Segment|00:00 - 3:33:08') {
        Write-Host "Line $($i+1): $($lines[$i].Trim())"
    }
}
