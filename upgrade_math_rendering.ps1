# 1. Update csy3081_external.html to add KaTeX CDN and auto-render
$pathHtml = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html"
$html = [System.IO.File]::ReadAllText($pathHtml, [System.Text.Encoding]::UTF8)

$katexHead = @'
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- KaTeX CDN for Professional Math Rendering (Google/Academic Standard) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="if(window.renderAllMath) window.renderAllMath()"></script>
'@

if ($html -notmatch 'katex\.min\.css') {
    $html = $html.Replace('<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">', $katexHead)
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathHtml, $html, $utf8NoBom)
    Write-Host "Added KaTeX CDN links to csy3081_external.html."
} else {
    Write-Host "KaTeX already in csy3081_external.html."
}

# 2. Append Math styles to style.css
$pathCss = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\style.css"
$css = [System.IO.File]::ReadAllText($pathCss, [System.Text.Encoding]::UTF8)

$mathCss = @'

/* ==========================================================================
   MATHEMATICAL FORMULA STYLING (KaTeX & FALLBACK RENDERING)
   ========================================================================== */
.katex-display {
    margin: 1.25rem 0 !important;
    padding: 1.1rem !important;
    background: var(--bg-card-alt) !important;
    border: 1px solid var(--border-light) !important;
    border-radius: 10px !important;
    overflow-x: auto !important;
    text-align: center !important;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.03) !important;
}
.katex {
    font-size: 1.08em !important;
    color: var(--text-primary) !important;
}
[data-theme="dark"] .katex {
    color: #e2e8f0 !important;
}

/* Fallback Math Styling */
.display-math-fallback {
    margin: 1.25rem 0;
    padding: 1.1rem 1.5rem;
    background: var(--bg-card-alt);
    border: 1px solid var(--border-medium);
    border-radius: 10px;
    font-family: var(--font-mono);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--primary);
    text-align: center;
    overflow-x: auto;
    letter-spacing: 0.5px;
    box-shadow: inset 0 2px 6px rgba(0,0,0,0.04);
}
.inline-math-fallback {
    font-family: var(--font-mono);
    font-size: 0.95em;
    font-weight: 600;
    color: var(--primary);
    background: var(--primary-light);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(79, 70, 229, 0.2);
}
.math-fraction {
    display: inline-flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: center;
    padding: 0 4px;
    font-size: 0.9em;
}
.math-num {
    border-bottom: 1.5px solid currentColor;
    padding-bottom: 1px;
}
.math-den {
    padding-top: 1px;
}
'@

if ($css -notmatch 'display-math-fallback') {
    $css = $css + $mathCss
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathCss, $css, $utf8NoBom)
    Write-Host "Added math styling to style.css."
} else {
    Write-Host "Math styling already in style.css."
}

# 3. Add window.renderAllMath and window.formatMathFallback to app.js using single-quoted here-string
$pathJs = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js"
$js = [System.IO.File]::ReadAllText($pathJs, [System.Text.Encoding]::UTF8)

$mathJs = @'

/* ==========================================================================
   MATHEMATICAL FORMULA RENDERING ENGINE (KaTeX + OFFLINE FALLBACK)
   ========================================================================== */
window.formatMathFallback = function(container) {
    if (!container) return;
    if (container.querySelectorAll('.katex').length > 0) return;

    function cleanLatexString(str) {
        return str
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
            .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑<sub>$1</sub><sup>$2</sup>')
            .replace(/\\sum_\{([^}]+)\}/g, '∑<sub>$1</sub>')
            .replace(/\\sum/g, '∑')
            .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '∏<sub>$1</sub><sup>$2</sup>')
            .replace(/\\prod/g, '∏')
            .replace(/\\theta/g, 'θ')
            .replace(/\\sigma/g, 'σ')
            .replace(/\\mu/g, 'μ')
            .replace(/\\eta/g, 'η')
            .replace(/\\alpha/g, 'α')
            .replace(/\\beta/g, 'β')
            .replace(/\\gamma/g, 'γ')
            .replace(/\\Delta/g, 'Δ')
            .replace(/\\nabla/g, '∇')
            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
            .replace(/\\left\(|\\right\)/g, '')
            .replace(/\\left\||\\right\|/g, '|')
            .replace(/\\left\[|\\right\]/g, '')
            .replace(/\\mid/g, '|')
            .replace(/\\quad|\\qquad/g, ' &nbsp;&nbsp; ')
            .replace(/\\text\{([^}]+)\}/g, '<span style="font-family:var(--font-sans);font-weight:500;color:var(--text-secondary);">$1</span>')
            .replace(/\\in/g, '∈')
            .replace(/\\mathbb\{R\}/g, 'ℝ')
            .replace(/\\approx/g, '≈')
            .replace(/\\ge/g, '≥')
            .replace(/\\le/g, '≤')
            .replace(/\\rightarrow|\\to/g, '→')
            .replace(/\\Rightarrow/g, '⇒')
            .replace(/\\dots|\\ldots/g, '...')
            .replace(/\^([0-9A-Za-z]+)/g, '<sup>$1</sup>')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/_([0-9A-Za-z]+)/g, '<sub>$1</sub>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    }

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement && !['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(node.parentElement.tagName)) {
            if (node.nodeValue && (node.nodeValue.includes('$') || node.nodeValue.includes('\\(') || node.nodeValue.includes('\\['))) {
                textNodes.push(node);
            }
        }
    }

    textNodes.forEach(node => {
        let text = node.nodeValue;
        let modified = false;

        if (/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/.test(text)) {
            text = text.replace(/\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g, (match, p1, p2) => {
                const mathContent = p1 || p2;
                return `<div class="display-math-fallback">${cleanLatexString(mathContent)}</div>`;
            });
            modified = true;
        }

        if (/\$([^\$]+?)\$|\\\(([^\)]+?)\\\)/.test(text)) {
            text = text.replace(/\$([^\$]+?)\$|\\\(([^\)]+?)\\\)/g, (match, p1, p2) => {
                const mathContent = p1 || p2;
                return `<span class="inline-math-fallback">${cleanLatexString(mathContent)}</span>`;
            });
            modified = true;
        }

        if (modified) {
            const span = document.createElement('span');
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
        }
    });
};

window.renderAllMath = function(containerEl) {
    const el = containerEl || document.body;
    if (typeof renderMathInElement === 'function') {
        try {
            renderMathInElement(el, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
            return;
        } catch(e) {
            console.warn("KaTeX render error:", e);
        }
    }
    if (window.formatMathFallback) {
        window.formatMathFallback(el);
    }
};

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 600);
});
'@

if ($js -notmatch 'window\.renderAllMath') {
    $js = $js.Replace('function switchTabSection(tabId, anchorId = null) {', 'function switchTabSection(tabId, anchorId = null) { setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 50);')
    $js = $js + $mathJs
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathJs, $js, $utf8NoBom)
    Write-Host "Added math engine and hooks to app.js."
} else {
    Write-Host "Math engine already in app.js."
}

# 4. Also hook renderAllMath into test2_logic.js rendering functions
$pathTest2 = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test2_logic.js"
$test2Js = [System.IO.File]::ReadAllText($pathTest2, [System.Text.Encoding]::UTF8)
if ($test2Js -notmatch 'renderAllMath') {
    $test2Js = $test2Js.Replace('updateTest2ProgressUI();', 'updateTest2ProgressUI(); setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);')
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($pathTest2, $test2Js, $utf8NoBom)
    Write-Host "Hooked renderAllMath into test2_logic.js."
} else {
    Write-Host "renderAllMath already hooked in test2_logic.js."
}
