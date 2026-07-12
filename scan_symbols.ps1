$files = @('csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')
foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    if (Test-Path $path) {
        $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
        $lines = $content -split "`r?`n"
        $count = 0
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match 'â|•|&bull;|\b\d{2}:\d{2}\b|\[\d{1,2}:\d{2}|card-time|time-badge|(`\b\d+ Qs`)|(`\b\d+ Demos`)') {
                $count++
                if ($count -le 25) {
                    Write-Host "$f ($($i+1)): $($lines[$i].Trim())"
                }
            }
        }
        Write-Host "Total matches in $f : $count"
        Write-Host "-------------------------------------"
    }
}
