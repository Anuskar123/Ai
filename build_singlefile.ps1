# Read with explicit UTF8 encoding
$html = Get-Content -Path "csy3081_external.html" -Encoding UTF8 -Raw
$css = Get-Content -Path "style.css" -Encoding UTF8 -Raw
$js = Get-Content -Path "app.js" -Encoding UTF8 -Raw

# 1. Clean out the external stylesheet and script tags from HTML
$htmlClean = $html -replace '<link rel="stylesheet" href="style\.css[^"]*">', ""
$htmlClean = $htmlClean -replace '<script src="app\.js[^"]*"></script>', ""

# 2. Insert inline <style> inside <head>
$styleTag = "`n<style>`n" + $css + "`n</style>`n</head>"
$htmlCombined = $htmlClean -replace '</head>', $styleTag

# 3. Insert inline <script> right before </body>
$scriptTag = "`n<script>`n" + $js + "`n</script>`n</body>"
$htmlCombined = $htmlCombined -replace '</body>', $scriptTag

# 4. Save both index.html (as 100% single-file) and csy3081_standalone.html
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $htmlCombined, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $htmlCombined, $utf8NoBom)

# 5. Also save csy3081_external.html that links to clean style.css and app.js (without ?v= query strings) for maximum compatibility
$htmlExternal = $html -replace 'style\.css[^"]*', 'style.css'
$htmlExternal = $htmlExternal -replace 'app\.js[^"]*', 'app.js'
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $htmlExternal, $utf8NoBom)

Write-Host "Complete! Built self-contained single-file index.html ($($htmlCombined.Length) bytes)."
