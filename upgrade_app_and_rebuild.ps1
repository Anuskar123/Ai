# 1. Read app.js and add _hasInit guards to all init handlers so buttons NEVER get double-registered
$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Replace initNavigation
$js = $js -replace 'function initNavigation\(\) \{(\r?\n)?\s*const navBar = document\.getElementById\(\x27main-nav\x27\);(\r?\n)?\s*if \(!navBar\) return;', 'function initNavigation() {
    const navBar = document.getElementById("main-nav");
    if (!navBar || navBar._hasInit) return;
    navBar._hasInit = true;'

# Replace initDashboardHandlers
$js = $js -replace 'function initDashboardHandlers\(\) \{(\r?\n)?\s*const startBtn = document\.getElementById\(\x27btn-start-exam\x27\);', 'function initDashboardHandlers() {
    if (window._hasInitDashboard) return;
    window._hasInitDashboard = true;
    const startBtn = document.getElementById("btn-start-exam");'

# Replace initExamHandlers
$js = $js -replace 'function initExamHandlers\(\) \{(\r?\n)?\s*const filterBar = document\.getElementById\(\x27filter-buttons\x27\);', 'function initExamHandlers() {
    if (window._hasInitExam) return;
    window._hasInitExam = true;
    const filterBar = document.getElementById("filter-buttons");'

# Add protection inside switchTabSection against clashing or double firing
$oldSwitch = 'function switchTabSection(tabId, anchorId = null) {
    try {
        document.querySelectorAll(''.content-section'').forEach(sec => sec.classList.remove(''active''));'

$newSwitch = 'function switchTabSection(tabId, anchorId = null) {
    try {
        if (!document.getElementById(`section-${tabId}`)) {
            console.warn(`Target section section-${tabId} not found.`);
            return;
        }
        document.querySelectorAll(".content-section").forEach(sec => sec.classList.remove("active"));'

$js = $js.Replace($oldSwitch, $newSwitch)

# Save upgraded app.js
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", $js, $utf8NoBom)

# 2. Now read index.html and strip EVERY single script and style tag completely to build a true 1-to-1 standalone file
$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)

# Strip all <style> blocks
$html = [regex]::Replace($html, '(?s)<style>.*?</style>', '')
# Strip all <script> blocks
$html = [regex]::Replace($html, '(?s)<script>.*?</script>', '')
# Strip any external links to style.css or app.js
$html = [regex]::Replace($html, '<link rel="stylesheet" href="style\.css[^"]*">', '')
$html = [regex]::Replace($html, '<script src="app\.js[^"]*"></script>', '')

$css = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css", [System.Text.Encoding]::UTF8)

# Insert exact 1 style tag inside <head>
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
        banner.innerText = "JS Warning (Line " + line + "): " + msg + " • Please press Ctrl+F5 to hard-refresh.";
    }
};
</script>
</head>
"@

$html = $html -replace '</head>', $headInsert

# Insert exact 1 main application script tag before </body>
$scriptInsert = @"

<script>
(() => {
$js
})();
</script>
</body>
"@

$html = $html -replace '</body>', $scriptInsert

[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", $html, $utf8NoBom)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_standalone.html", $html, $utf8NoBom)

# Also save csy3081_external.html cleanly
$extHtml = [regex]::Replace($html, '(?s)<style>.*?</style>', '<link rel="stylesheet" href="style.css">')
$extHtml = [regex]::Replace($extHtml, '(?s)<script>\s*\(\(\) => \{.*?\)\(\);\s*</script>', '<script src="app.js"></script>')
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $extHtml, $utf8NoBom)

$sCount = [regex]::Matches($html, "<style>").Count
$cCount = [regex]::Matches($html, "<script>").Count
Write-Host "Rebuild complete! index.html size: $($html.Length) bytes."
Write-Host "Exact <style> count in index.html : $sCount"
Write-Host "Exact <script> count in index.html : $cCount (1 top diagnostic + 1 main IIFE app block)"
