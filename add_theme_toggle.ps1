# 1. Update csy3081_external.html
$pathHtml = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html"
$html = [System.IO.File]::ReadAllText($pathHtml, [System.Text.Encoding]::UTF8)

$oldStatus = '<div class="user-status">'
$newStatus = @'
<div class="user-status" style="display: flex; align-items: center; gap: 1.2rem;">
                <button id="btn-theme-toggle" class="theme-toggle-btn" onclick="if(window.toggleTheme) toggleTheme()" title="Switch between Executive Light and Midnight Dark themes">
                    <span id="theme-toggle-icon">🌙</span>
                    <span id="theme-toggle-text">Dark Studio</span>
                </button>
'@

if ($html -notmatch 'btn-theme-toggle') {
    $html = $html.Replace($oldStatus, $newStatus)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathHtml, $html, $utf8NoBom)
    Write-Host "Added theme toggle button to csy3081_external.html."
} else {
    Write-Host "Theme toggle button already exists in csy3081_external.html."
}

# 2. Update app.js
$pathJs = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js"
$js = [System.IO.File]::ReadAllText($pathJs, [System.Text.Encoding]::UTF8)

$themeScript = @"

/* ==========================================================================
   THEME TOGGLE & PROFESSIONAL WORKBENCH INITIALIZATION
   ========================================================================== */
window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('csy3081_theme_preference', newTheme);
    updateThemeToggleUI(newTheme);
    if (typeof showToast === 'function') {
        showToast(newTheme === 'dark' ? "Switched to Midnight Studio Dark Theme" : "Switched to Executive Light Academic Theme");
    }
};

window.updateThemeToggleUI = function(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const text = document.getElementById('theme-toggle-text');
    if (icon && text) {
        if (theme === 'dark') {
            icon.innerText = '☀️';
            text.innerText = 'Executive Light';
        } else {
            icon.innerText = '🌙';
            text.innerText = 'Dark Studio';
        }
    }
};

// Initialize saved theme on script load & DOMContentLoaded
(function() {
    try {
        const savedTheme = localStorage.getItem('csy3081_theme_preference');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        window.addEventListener('DOMContentLoaded', function() {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            if (window.updateThemeToggleUI) updateThemeToggleUI(current);
        });
        // Also run immediately if DOM is already ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            if (window.updateThemeToggleUI) updateThemeToggleUI(current);
        }
    } catch(e) {
        console.error("Theme init error:", e);
    }
})();
"@

if ($js -notmatch 'window\.toggleTheme') {
    $js = $js + $themeScript
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathJs, $js, $utf8NoBom)
    Write-Host "Added toggleTheme script to app.js."
} else {
    Write-Host "toggleTheme already in app.js."
}
