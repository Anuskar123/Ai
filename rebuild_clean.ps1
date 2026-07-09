# Read csy3081_external.html which has clean HTML skeleton without inline CSS/JS
$htmlClean = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Strip any existing <link rel="stylesheet" href="style.css"> or <script src="app.js"></script>
$htmlClean = [regex]::Replace($htmlClean, '<link rel="stylesheet" href="style\.css[^"]*">', '')
$htmlClean = [regex]::Replace($htmlClean, '<script src="app\.js[^"]*"></script>', '')

# Insert inline style inside head
$styleTag = "`n<style>`n" + $css + "`n</style>`n</head>"
$htmlCombined = $htmlClean -replace '</head>', $styleTag

# Insert inline script right before </body>
$scriptTag = "`n<script>`n" + $js + "`n</script>`n</body>"
$htmlCombined = $htmlCombined -replace '</body>', $scriptTag

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $htmlCombined, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $htmlCombined, $utf8NoBom)

# Verify counts
$sCount = [regex]::Matches($htmlCombined, "<style>").Count
$cCount = [regex]::Matches($htmlCombined, "<script>").Count
Write-Host "Rebuilt clean self-contained index.html ($($htmlCombined.Length) bytes)."
Write-Host "Count of <style> : $sCount (Exact)"
Write-Host "Count of <script> : $cCount (Diagnostic top + Main app bottom)"
