$files = @('app.js', 'test2_logic.js')
foreach ($f in $files) {
    $p = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    $c = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
    $c = $c.Replace('console.error("renderTest1Questions error:", err);', 'console.error("renderTest1Questions error:", err); window._lastRenderError = err.toString() + " at test1";')
    $c = $c.Replace('console.error("renderTest2Questions error:", err);', 'console.error("renderTest2Questions error:", err); window._lastRenderError = err.toString() + " at test2";')
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($p, $c, $utf8NoBom)
}
Write-Host "Added window._lastRenderError tracking to catch blocks."
