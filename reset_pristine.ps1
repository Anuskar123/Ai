# Read the external skeleton or index.html and completely strip all style and script blocks
$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)

# Strip all <style> blocks
$html = [regex]::Replace($html, '(?s)<style>.*?</style>', '')
# Strip all <script> blocks
$html = [regex]::Replace($html, '(?s)<script>.*?</script>', '')
# Strip any link to style.css or script src app.js
$html = [regex]::Replace($html, '<link rel="stylesheet" href="style\.css[^"]*">', '')
$html = [regex]::Replace($html, '<script src="app\.js[^"]*"></script>', '')

$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Add top diagnostic block + exact single style tag
$headInsert = @"

<style>
$css
</style>
<script>
window.onerror = function(msg, url, line, col, err) {
    console.error("Global JS Error Line " + line + ":", msg, err);
    var banner = document.getElementById('js-error-banner');
    if (banner) {
        banner.style.display = 'block';
        banner.innerText = "JS Warning (Line " + line + "): " + msg + " • Please press Ctrl+F5 to refresh.";
    }
};
</script>
</head>
"@

$html = $html -replace '</head>', $headInsert

# Wrap app.js inside an IIFE so variables never clash with global scope while keeping window functions accessible
$scriptInsert = @"

<script>
(() => {
$js
})();
</script>
</body>
"@

$html = $html -replace '</body>', $scriptInsert

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $html, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $html, $utf8NoBom)

# Also write clean external skeleton to csy3081_external.html
$extHtml = [regex]::Replace($html, '(?s)<style>.*?</style>', '<link rel="stylesheet" href="style.css">')
$extHtml = [regex]::Replace($extHtml, '(?s)<script>\s*\(\(\) => \{.*?\)\(\);\s*</script>', '<script src="app.js"></script>')
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $extHtml, $utf8NoBom)

$sCount = [regex]::Matches($html, "<style>").Count
$cCount = [regex]::Matches($html, "<script>").Count
Write-Host "Pristine single-file rebuild complete! Size: $($html.Length) bytes."
Write-Host "Exact <style> count : $sCount"
Write-Host "Exact <script> count : $cCount (1 diagnostic + 1 IIFE wrapped app logic)"
