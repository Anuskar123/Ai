# Read existing html and strip out ALL style blocks and script blocks except the top diagnostic block
$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)

# Remove all <style>...</style> blocks
$htmlNoStyle = [regex]::Replace($html, '(?s)<style>.*?</style>', '')
# Remove all <script>...</script> blocks EXCEPT window.onerror
$htmlNoScript = [regex]::Replace($htmlNoStyle, '(?s)<script>(?!.*?window\.onerror).*?</script>', '')
$htmlNoScript = [regex]::Replace($htmlNoScript, '<link rel="stylesheet" href="style\.css[^"]*">', '')
$htmlNoScript = [regex]::Replace($htmlNoScript, '<script src="app\.js[^"]*"></script>', '')

$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Now insert exact single <style> and single <script>
$styleTag = "`n<style>`n" + $css + "`n</style>`n</head>"
$htmlCleanCombined = $htmlNoScript -replace '</head>', $styleTag

$scriptTag = "`n<script>`n" + $js + "`n</script>`n</body>"
$htmlCleanCombined = $htmlCleanCombined -replace '</body>', $scriptTag

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $htmlCleanCombined, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $htmlCleanCombined, $utf8NoBom)

# Verify counts exactly
$sCount = [regex]::Matches($htmlCleanCombined, "<style>").Count
$cCount = [regex]::Matches($htmlCleanCombined, "<script>").Count
Write-Host "Clean rebuild complete! Size: $($htmlCleanCombined.Length) bytes."
Write-Host "Count of <style> : $sCount"
Write-Host "Count of <script> : $cCount"
