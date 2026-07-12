$files = @('index.html', 'csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')
foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    $c = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    $matches = [regex]::Matches($c, '\u00E2|\u00C3|\u00EF|\?\?').Count
    Write-Host "[$f] True Mojibake matches: $matches"
}
