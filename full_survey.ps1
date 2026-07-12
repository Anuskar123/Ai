$files = @('csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\$f", [System.Text.Encoding]::UTF8)
    $lines = $content -split "`r?`n"
    Write-Host "==================== $f ($($lines.Length) lines) ===================="
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $l = $lines[$i]
        # Check for non-ASCII or mojibake or timestamps
        if ($l -match 'â|•|&bull;|Ã|ï¼|`00:00|00:00 -|\[\d{1,2}:\d{2}|`\[\d{1,2}:\d{2}|\b\d{1,2}:\d{2}(?::\d{2})?\b') {
            # Ignore standard CSS or JS like 12:00 if not timestamp, but let's print all to see
            if ($l -notmatch 'box-shadow|z-index|stroke|min-height|line-height') {
                Write-Host "$($i+1): $($l.Trim())"
            }
        }
    }
}
