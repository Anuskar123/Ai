$files = @('csy3081_external.html', 'app.js', 'test2_logic.js')
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\$f", [System.Text.Encoding]::UTF8)
    $matches = [regex]::Matches($c, 'style="([^"]+)"')
    Write-Host "[$f] Found $($matches.Count) inline style attributes."
    for ($i = 0; $i -lt [Math]::Min($matches.Count, 15); $i++) {
        Write-Host "   $($matches[$i].Value)"
    }
}
