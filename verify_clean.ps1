$files = @('index.html', 'csy3081_standalone.html', 'csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')

foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    if (-not (Test-Path $path)) { continue }
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $lines = $content -split "`r?`n"
    
    $timeMatches = 0
    $mojiMatches = 0
    for ($i = 0; $i -lt $lines.Length; $i++) {
        $l = $lines[$i]
        # Check for times e.g. [20:24] or `00:00 or similar
        if ($l -match '\[\d{1,2}:\d{2}(?::\d{2})?|`00:00|00:00 -|\b\d{1,2}:\d{2}(?::\d{2})?\b') {
            if ($l -notmatch 'box-shadow|z-index|stroke|min-height|line-height|30:00|00:00|timer-clock') {
                Write-Host "[$f] Remaining Time (Line $($i+1)): $($l.Trim())"
                $timeMatches++
            }
        }
        if ($l -match '[\u0080-\uFFFF]|\?\?\s*Official|\?\?\s*Real|\?\?\s*Revealed') {
            # Let's print any non-ASCII or ?? remaining
            Write-Host "[$f] Remaining Non-ASCII/Moji (Line $($i+1)): $($l.Trim())"
            $mojiMatches++
        }
    }
    Write-Host "Finished checking $f -> Times: $timeMatches | Mojibake: $mojiMatches"
}
