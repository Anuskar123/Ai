# 1. Read csy3081_external.html or index.html and extract ONLY the pure HTML body up to </head> and between </head> and </body> without scripts/styles
$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)

# Find first <style> and slice top up to </head>
$headEnd = $html.IndexOf("</head>")
$topHtml = $html.Substring(0, $headEnd)

# Strip any existing <style> or <script> inside topHtml
while ($topHtml.IndexOf("<style>") -ge 0) {
    $s = $topHtml.IndexOf("<style>")
    $e = $topHtml.IndexOf("</style>", $s) + 8
    $topHtml = $topHtml.Substring(0, $s) + $topHtml.Substring($e)
}
while ($topHtml.IndexOf("<script>") -ge 0) {
    $s = $topHtml.IndexOf("<script>")
    $e = $topHtml.IndexOf("</script>", $s) + 9
    $topHtml = $topHtml.Substring(0, $s) + $topHtml.Substring($e)
}

# Now get body from </head> to </body>
$bodyStart = $html.IndexOf("</head>") + 7
$bodyEnd = $html.LastIndexOf("</body>")
$bodyHtml = $html.Substring($bodyStart, $bodyEnd - $bodyStart)

# Strip all <script> blocks inside bodyHtml
while ($bodyHtml.IndexOf("<script") -ge 0) {
    $s = $bodyHtml.IndexOf("<script")
    $e = $bodyHtml.IndexOf("</script>", $s) + 9
    $bodyHtml = $bodyHtml.Substring(0, $s) + $bodyHtml.Substring($e)
}
while ($bodyHtml.IndexOf("<style>") -ge 0) {
    $s = $bodyHtml.IndexOf("<style>")
    $e = $bodyHtml.IndexOf("</style>", $s) + 8
    $bodyHtml = $bodyHtml.Substring(0, $s) + $bodyHtml.Substring($e)
}

# Also strip any stray external links
$bodyHtml = $bodyHtml -replace '<link rel="stylesheet" href="style\.css[^"]*">', ''
$bodyHtml = $bodyHtml -replace '<script src="app\.js[^"]*"></script>', ''
$topHtml = $topHtml -replace '<link rel="stylesheet" href="style\.css[^"]*">', ''
$topHtml = $topHtml -replace '<script src="app\.js[^"]*"></script>', ''

$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Assemble exact 1 style and exact 2 script tags (1 top diagnostic, 1 main app)
$finalHtml = $topHtml + @"

<style>
$css
</style>
<script>
window.onerror = function(msg, url, line, col, err) {
    console.error("Global JS Error Line " + line + ":", msg, err);
    var banner = document.getElementById('js-error-banner');
    if (banner) {
        banner.style.display = 'block';
        banner.innerText = "JS Warning (Line " + line + "): " + msg + " • Please press Ctrl+F5 to hard-refresh.";
    }
};
</script>
</head>
"@ + $bodyHtml + @"

<script>
(() => {
$js
})();
</script>
</body>
</html>
"@

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $finalHtml, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $finalHtml, $utf8NoBom)

# Also save clean csy3081_external.html
$extHtml = $topHtml + @"

<link rel="stylesheet" href="style.css">
</head>
"@ + $bodyHtml + @"

<script src="app.js"></script>
</body>
</html>
"@
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $extHtml, $utf8NoBom)

$sCount = ([regex]::Matches($finalHtml, "<style>")).Count
$cCount = ([regex]::Matches($finalHtml, "<script>")).Count
Write-Host "Pristine string-slice rebuild complete! index.html size: $($finalHtml.Length) bytes."
Write-Host "Exact <style> count in index.html : $sCount"
Write-Host "Exact <script> count in index.html : $cCount"
