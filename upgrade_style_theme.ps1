$path = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Extract everything from `* { box-sizing: border-box;` onwards or replace `:root` section
$idx = $content.IndexOf('* {')
if ($idx -gt 0) {
    $rest = $content.Substring($idx)
} else {
    $rest = $content
}

$newRootAndTheme = @"
/* ==========================================================================
   APPLIED AI & MACHINE LEARNING PLATFORM - PROFESSIONAL LEARNING THEME
   ========================================================================== */

:root {
    /* Executive Cool Slate & Royal Indigo Academic Palette */
    --bg-page: #f8fafc;            /* Executive Cool Slate Background */
    --bg-card: #ffffff;            /* Pure Crisp White Card Surface */
    --bg-card-alt: #f1f5f9;        /* Soft Slate Secondary Surface */
    --bg-code: #0f172a;            /* Deep Slate Code Window */
    
    --border-light: #e2e8f0;       /* Crisp Subtle Border */
    --border-medium: #cbd5e1;      /* Polished Mid-tone Border */
    --border-dark: #94a3b8;        /* High-Contrast Border */
    
    --text-primary: #0f172a;       /* Deep Academic Navy Text */
    --text-secondary: #334155;     /* Refined Slate Body Text */
    --text-muted: #64748b;         /* Muted Metadata Text */
    --text-inverse: #ffffff;       /* Pure White Inverse Text */
    
    --primary: #4f46e5;            /* Royal Academic Indigo */
    --primary-hover: #4338ca;      /* Deep Indigo Hover */
    --primary-light: #e0e7ff;      /* Soft Indigo Tint */
    --primary-gradient: linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%);
    
    --accent-green: #059669;       /* Emerald Green Success */
    --accent-green-light: #ecfdf5;
    --accent-orange: #d97706;      /* Amber Points/Honors */
    --accent-orange-light: #fffbeb;
    --accent-purple: #7c3aed;      /* Violet Deep Learning Theory */
    --accent-purple-light: #f3e8ff;
    --accent-red: #dc2626;         /* Crimson Alert */
    --accent-cyan: #0284c7;        /* Cerulean Interactive Simulators */
    --accent-cyan-light: #e0f2fe;
    
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02);
    --shadow-md: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04);
    --shadow-lg: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
    --shadow-glow: 0 0 25px rgba(79, 70, 229, 0.2);
}

[data-theme="dark"] {
    --bg-page: #0b1120;            /* Deep Navy Midnight Backdrop */
    --bg-card: #111827;            /* Elevated Dark Card Surface */
    --bg-card-alt: #1e293b;        /* Secondary Slate Dark Surface */
    --bg-code: #080c14;            /* Ultra-Dark Code Window */
    
    --border-light: rgba(255, 255, 255, 0.08);
    --border-medium: rgba(255, 255, 255, 0.15);
    --border-dark: rgba(255, 255, 255, 0.25);
    
    --text-primary: #f8fafc;       /* High-Contrast White Text */
    --text-secondary: #cbd5e1;     /* Polished Silver/Slate Text */
    --text-muted: #94a3b8;         /* Soft Muted Dark Mode Text */
    --text-inverse: #0f172a;       /* Inverse Dark Navy Text */
    
    --primary: #6366f1;            /* Vibrant Royal Indigo */
    --primary-hover: #818cf8;      /* Bright Indigo Hover */
    --primary-light: rgba(99, 102, 241, 0.18);
    --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%);
    
    --accent-green: #10b981;       /* Emerald Success */
    --accent-green-light: rgba(16, 185, 129, 0.15);
    --accent-orange: #f59e0b;      /* Amber Points/Honors */
    --accent-orange-light: rgba(245, 158, 11, 0.15);
    --accent-purple: #a855f7;      /* Violet Deep Learning Theory */
    --accent-purple-light: rgba(168, 85, 247, 0.15);
    --accent-red: #ef4444;         /* Crimson Alert */
    --accent-cyan: #06b6d4;        /* Cerulean Simulators */
    --accent-cyan-light: rgba(6, 182, 212, 0.15);
    
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
    --shadow-glow: 0 0 30px rgba(99, 102, 241, 0.35);
}

"@

# Replace topbar styling with upgraded glassmorphism and modern tabs
$rest = [regex]::Replace($rest, '\.topbar \{[\s\S]*?\}', @'
.topbar {
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-light);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
    transition: background 0.3s ease, border-color 0.3s ease;
}
[data-theme="dark"] .topbar {
    background: rgba(17, 24, 39, 0.88);
}
'@)

$rest = [regex]::Replace($rest, '\.brand-logo \{[\s\S]*?\}', @'
.brand-logo {
    width: 40px;
    height: 40px;
    background: var(--primary-gradient);
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.brand-logo:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-glow);
}
'@)

$rest = [regex]::Replace($rest, '\.nav-tabs \{[\s\S]*?\}', @'
.nav-tabs {
    display: flex;
    gap: 0.35rem;
    background: var(--bg-card-alt);
    padding: 0.35rem;
    border-radius: 12px;
    border: 1px solid var(--border-light);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
}
'@)

$rest = [regex]::Replace($rest, '\.nav-tab \{[\s\S]*?\}', @'
.nav-tab {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-family: var(--font-sans);
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
'@)

$rest = [regex]::Replace($rest, '\.nav-tab:hover \{[\s\S]*?\}', @'
.nav-tab:hover {
    color: var(--primary);
    background: var(--primary-light);
    transform: translateY(-1px);
}
'@)

$rest = [regex]::Replace($rest, '\.nav-tab\.active \{[\s\S]*?\}', @'
.nav-tab.active {
    background: var(--bg-card);
    color: var(--primary);
    font-weight: 700;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-medium);
}
'@)

# Append dynamic JS-rendered classes at the bottom of style.css
$jsClasses = @"

/* ==========================================================================
   DYNAMIC CLASSES FOR PRACTICE EXAMS & SIMULATORS (JS-RENDERED)
   ========================================================================== */
.code-box {
    background: var(--bg-code) !important;
    border: 1px solid var(--border-medium) !important;
    border-radius: 10px !important;
    padding: 1.25rem !important;
    margin: 1.25rem 0 !important;
    overflow-x: auto !important;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.2) !important;
}
.code-text {
    font-family: var(--font-mono) !important;
    color: #38bdf8 !important;
    font-size: 0.9rem !important;
    line-height: 1.6 !important;
}
.data-table {
    width: 100% !important;
    margin: 1.25rem 0 !important;
    border-collapse: collapse !important;
    background: var(--bg-card) !important;
    border: 1px solid var(--border-light) !important;
    border-radius: 10px !important;
    overflow: hidden !important;
}
.table-header {
    background: var(--bg-card-alt) !important;
    border-bottom: 2px solid var(--border-medium) !important;
}
.table-cell-th {
    padding: 12px 14px !important;
    text-align: left !important;
    color: var(--text-primary) !important;
    font-weight: 700 !important;
    font-size: 0.88rem !important;
}
.table-row {
    border-bottom: 1px solid var(--border-light) !important;
    transition: background 0.15s ease !important;
}
.table-row:hover {
    background: var(--bg-card-alt) !important;
}
.table-cell-colA {
    padding: 12px 14px !important;
    font-weight: 600 !important;
    color: var(--primary) !important;
}
.table-cell-colB {
    padding: 12px 14px !important;
    color: var(--text-secondary) !important;
    line-height: 1.5 !important;
}
.status-neutral {
    background: var(--bg-card-alt) !important;
    color: var(--text-secondary) !important;
    border: 1px solid var(--border-medium) !important;
}
.status-alert {
    background: #fef2f2 !important;
    color: var(--accent-red) !important;
    border: 1px solid #fca5a5 !important;
}
[data-theme="dark"] .status-alert {
    background: rgba(239, 68, 68, 0.15) !important;
    border-color: rgba(239, 68, 68, 0.4) !important;
}
/* Theme Toggle Button Styling */
.theme-toggle-btn {
    background: var(--bg-card-alt);
    border: 1px solid var(--border-medium);
    color: var(--text-primary);
    padding: 0.45rem 0.95rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: var(--shadow-sm);
}
.theme-toggle-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}
"@

$finalCss = $newRootAndTheme + $rest + $jsClasses
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $finalCss, $utf8NoBom)
Write-Host "Successfully upgraded style.css with Executive Indigo & Slate theme + Dark Mode support ($($finalCss.Length) bytes)."
