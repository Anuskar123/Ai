$files = @('csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')
foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\$f", [System.Text.Encoding]::UTF8)
    $lines = $content -split "`r?`n"
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match '\?\?||Ã|ï¼|[\u0080-\uFFFF]') {
            Write-Host "$f Line $($i+1): $($lines[$i].Trim())"
        }
    }
}
