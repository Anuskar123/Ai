$pathJs = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js"
$js = [System.IO.File]::ReadAllText($pathJs, [System.Text.Encoding]::UTF8)

# 1. Add global resetSingleQuestion function attached to window
$resetFunc = @"
// --- SINGLE QUESTION RESET & RE-ATTEMPT ENGINE ---
window.resetSingleQuestion = function(qid, section) {
    setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
    try {
        if (section === 'dashboard' || section === 'bank') {
            if (solvedState && solvedState[qid]) {
                delete solvedState[qid];
                localStorage.setItem('csy3081_solved_v1', JSON.stringify(solvedState));
            }
            if (typeof renderQuizList === 'function') renderQuizList();
            if (typeof updateProgressUI === 'function') updateProgressUI();
            if (typeof showToast === 'function') showToast("🔄 Question " + qid + " cleared. Type or select your new answer!");
        } else if (section === 'test1') {
            if (window.test1SolvedState && window.test1SolvedState[qid]) {
                delete window.test1SolvedState[qid];
                localStorage.setItem('csy3081_test1_solved_v1', JSON.stringify(window.test1SolvedState));
            }
            if (typeof renderTest1Questions === 'function') renderTest1Questions(window.test1CurrentFilter || 'all');
            if (typeof updateTest1ProgressUI === 'function') updateTest1ProgressUI();
            if (typeof showToast === 'function') showToast("🔄 Test 1 Question " + qid + " cleared. Try again!");
        } else if (section === 'test2') {
            if (window.test2SolvedState && window.test2SolvedState[qid]) {
                delete window.test2SolvedState[qid];
                localStorage.setItem('csy3081_test2_solved_v1', JSON.stringify(window.test2SolvedState));
            }
            if (typeof renderTest2Questions === 'function') renderTest2Questions(window.test2CurrentFilter || 'all');
            if (typeof updateTest2ProgressUI === 'function') updateTest2ProgressUI();
            if (typeof showToast === 'function') showToast("🔄 Test 2 Question " + qid + " cleared. Try again!");
        }
    } catch (e) {
        console.error("resetSingleQuestion error:", e);
    }
};
"@

if (-not $js.Contains("window.resetSingleQuestion = function")) {
    $js = $js.Replace("window.resetProgress = resetProgress;", "window.resetProgress = resetProgress;`n`n" + $resetFunc)
    Write-Host "Added window.resetSingleQuestion."
}

# 2. Upgrade handleBlankSubmission and renderQuizList for fill-in-the-blank
$oldBlankBlock = @"
            if (q.type === 'fill-blank') {
                const userText = (isSolved && isSolved.selected) ? isSolved.selected : '';
                const isDisabled = (examMode === 'practice' && isSolved) ? 'disabled' : '';
                html += ``
                    <div class="input-row">
                        <input type="text" id="input-${q.id}" class="input-text" placeholder="Type answer keyword (e.g. splitting)" value="${userText}" ${isDisabled}>
                        ${(examMode === 'practice' && !isSolved) ? ``<button class="btn btn-primary btn-sm btn-check-blank" data-qid="${q.id}">Check Answer</button>`` : ''}
                    </div>
                ``;
            }
"@ -replace "``", "`$"

$newBlankBlock = @"
            if (q.type === 'fill-blank') {
                const userText = (isSolved && isSolved.selected && isSolved.selected !== 'exam_submitted') ? isSolved.selected : '';
                const statusBadgeText = isSolved ? (isSolved.status === 'correct' ? '<span style="color:#10b981;font-weight:700;margin-left:8px;">✓ Correct (+1 Pt)</span>' : '<span style="color:#ef4444;font-weight:700;margin-left:8px;">× Incorrect</span>') : '';
                html += ``
                    <div class="input-row" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;">
                        <input type="text" id="input-${q.id}" class="input-text" placeholder="Type your answer (e.g. splitting)..." value="${userText}" style="flex:1;min-width:220px;padding:8px 12px;border:2px solid var(--border-color);border-radius:6px;background:var(--card-bg);color:var(--text-primary);font-size:0.95rem;">
                        <button class="btn btn-primary btn-sm btn-check-blank" data-qid="${q.id}" onclick="if(window.handleBlankSubmission) window.handleBlankSubmission('${q.id}')" style="background:#4f46e5;color:#fff;font-weight:600;padding:8px 16px;border-radius:6px;border:none;cursor:pointer;">${isSolved ? '🔄 Update Answer' : '✓ Check Answer'}</button>
                        ${isSolved ? ``<button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion('${q.id}', 'dashboard')" style="background:#3b82f6;color:#fff;font-weight:600;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;">🔄 Reset Blank</button>`` : ''}
                        ${statusBadgeText}
                    </div>
                ``;
            }
"@ -replace "``", "`$"

if ($js.Contains($oldBlankBlock)) {
    $js = $js.Replace($oldBlankBlock, $newBlankBlock)
    Write-Host "Updated fill-blank UI in renderQuizList exact."
} else {
    $js = [regex]::Replace($js, 'if\s*\(\s*q\.type\s*===\s*''fill-blank''\s*\)\s*\{[\s\S]*?<\/\s*div\s*>\s*`\s*;\s*\}', $newBlankBlock)
    Write-Host "Updated fill-blank UI via regex."
}

# 3. Add Reset Single Question button inside Dashboard MCQ
$oldExplanationDash = '<div class="quiz-explanation ${isSolved ? ''show'' : ''}">' -replace "'", "`$"
$newExplanationDash = '${isSolved ? `<div style="margin-top:12px;margin-bottom:8px;"><button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion(\'${q.id}\', \'dashboard\')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button></div>` : \'\'}' + "`n                " + '<div class="quiz-explanation ${isSolved ? ''show'' : ''}">' -replace "'", "`$"

if ($js.Contains($oldExplanationDash) -and -not $js.Contains("resetSingleQuestion('`${q.id}', 'dashboard')")) {
    $js = $js.Replace($oldExplanationDash, $newExplanationDash)
    Write-Host "Added Reset Single to Dashboard."
}

# 4. Add Reset Single Question button inside Test 1 Cards
$oldExplanationTest1 = '<div class="test1-explanation ${solved ? ''show'' : ''}" id="test1-exp-${q.id}">' -replace "'", "`$"
$newExplanationTest1 = '${solved ? `<div style="margin-top:12px;margin-bottom:8px;"><button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion(\'${q.id}\', \'test1\')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button></div>` : \'\'}' + "`n                " + '<div class="test1-explanation ${solved ? ''show'' : ''}" id="test1-exp-${q.id}">' -replace "'", "`$"

if ($js.Contains($oldExplanationTest1) -and -not $js.Contains("resetSingleQuestion('`${q.id}', 'test1')")) {
    $js = $js.Replace($oldExplanationTest1, $newExplanationTest1)
    Write-Host "Added Reset Single to Test 1."
}

# 5. Add Reset Single Question button inside Test 2 Cards
$oldExplanationTest2 = '<div class="test1-explanation ${solved ? ''show'' : ''}" id="test2-exp-${q.id}" style="border-left:4px solid var(--primary);">' -replace "'", "`$"
$newExplanationTest2 = '${solved ? `<div style="margin-top:12px;margin-bottom:8px;"><button class="btn btn-secondary btn-sm" onclick="if(window.resetSingleQuestion) window.resetSingleQuestion(\'${q.id}\', \'test2\')" style="background:#3b82f6;color:#fff;font-weight:600;padding:6px 14px;border-radius:6px;border:1px solid #60a5fa;cursor:pointer;">🔄 Reset Question & Try Again</button></div>` : \'\'}' + "`n                " + '<div class="test1-explanation ${solved ? ''show'' : ''}" id="test2-exp-${q.id}" style="border-left:4px solid var(--primary);">' -replace "'", "`$"

if ($js.Contains($oldExplanationTest2) -and -not $js.Contains("resetSingleQuestion('`${q.id}', 'test2')")) {
    $js = $js.Replace($oldExplanationTest2, $newExplanationTest2)
    Write-Host "Added Reset Single to Test 2."
}

# 6. Upgrade global resetProgress()
$oldResetFunc = @"
function resetProgress() {
    try {
        if (confirm("Are you sure you want to reset all solved CSY3081 exam answers and readiness progress?")) {
            solvedState = {};
            localStorage.removeItem('csy3081_solved_v1');
            updateProgressUI();
            renderQuizList();
            showToast(" CSY3081 study progress has been reset to 0%");
        }
    } catch (err) {
        console.error("Reset error:", err);
    }
}
"@

$newResetFunc = @"
function resetProgress() {
    try {
        if (confirm("Are you sure you want to reset ALL solved CSY3081 exam answers across Dashboard, Test 1, and Test 2?")) {
            solvedState = {};
            localStorage.removeItem('csy3081_solved_v1');
            if (window.test1SolvedState) {
                window.test1SolvedState = {};
                localStorage.removeItem('csy3081_test1_solved_v1');
            }
            if (window.test2SolvedState) {
                window.test2SolvedState = {};
                localStorage.removeItem('csy3081_test2_solved_v1');
            }
            if (typeof updateProgressUI === 'function') updateProgressUI();
            if (typeof renderQuizList === 'function') renderQuizList();
            if (typeof updateTest1ProgressUI === 'function') updateTest1ProgressUI();
            if (typeof renderTest1Questions === 'function' && document.getElementById('test1-questions-container')) renderTest1Questions(window.test1CurrentFilter || 'all');
            if (typeof updateTest2ProgressUI === 'function') updateTest2ProgressUI();
            if (typeof renderTest2Questions === 'function' && document.getElementById('test2-questions-container')) renderTest2Questions(window.test2CurrentFilter || 'all');
            showToast("🔄 All CSY3081 study progress (Dashboard, Test 1, and Test 2) reset to 0%");
            setTimeout(() => { if (window.renderAllMath) window.renderAllMath(); }, 30);
        }
    } catch (err) {
        console.error("Reset error:", err);
    }
}
"@

if ($js.Contains($oldResetFunc)) {
    $js = $js.Replace($oldResetFunc, $newResetFunc)
    Write-Host "Upgraded global resetProgress()."
} else {
    $js = [regex]::Replace($js, 'function resetProgress\(\)\s*\{[\s\S]*?showToast\([^\)]*\);\s*\}\s*\}\s*catch\s*\([^\)]*\)\s*\{[\s\S]*?\}\s*\}', $newResetFunc)
    Write-Host "Upgraded global resetProgress() via regex."
}

# 7. Upgrade cleanLatexString (`formatMathFallback`)
$oldCleanLatex = @"
    function cleanLatexString(str) {
        return str
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
            .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '&sum;<sub>$1</sub><sup>$2</sup>')
            .replace(/\\sum_\{([^}]+)\}/g, '&sum;<sub>$1</sub>')
            .replace(/\\sum/g, '&sum;')
            .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '&prod;<sub>$1</sub><sup>$2</sup>')
            .replace(/\\prod/g, '&prod;')
            .replace(/\\theta/g, '&theta;')
            .replace(/\\sigma/g, '&sigma;')
            .replace(/\\mu/g, '&mu;')
            .replace(/\\eta/g, '&eta;')
            .replace(/\\alpha/g, '&alpha;')
            .replace(/\\beta/g, '&beta;')
            .replace(/\\gamma/g, '&gamma;')
            .replace(/\\Delta/g, '&Delta;')
            .replace(/\\nabla/g, '&nabla;')
            .replace(/\\sqrt\{([^}]+)\}/g, '&radic;($1)')
            .replace(/\\left\(|\\right\)/g, '')
            .replace(/\\left\||\\right\|/g, '|')
            .replace(/\\left\[|\\right\]/g, '')
            .replace(/\\mid/g, '|')
            .replace(/\\quad|\\qquad/g, ' &nbsp;&nbsp; ')
            .replace(/\\text\{([^}]+)\}/g, '<span style="font-family:var(--font-sans);font-weight:500;color:var(--text-secondary);">$1</span>')
            .replace(/\\in/g, '&isin;')
            .replace(/\\mathbb\{R\}/g, '&#8477;')
            .replace(/\\approx/g, '&approx;')
            .replace(/\\ge/g, '&ge;')
            .replace(/\\le/g, '&le;')
            .replace(/\\rightarrow|\\to/g, '&rarr;')
            .replace(/\\Rightarrow/g, '&rArr;')
            .replace(/\\dots|\\ldots/g, '...')
            .replace(/\^([0-9A-Za-z]+)/g, '<sup>$1</sup>')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/_([0-9A-Za-z]+)/g, '<sub>$1</sub>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    }
"@

$newCleanLatex = @"
    function cleanLatexString(str) {
        return str
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
            .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-limit-top">$2</span><span class="math-op-sym">&sum;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\sum_\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-op-sym">&sum;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\sum/g, '<span class="math-op-sym">&sum;</span>')
            .replace(/\\prod_\{([^}]+)\}\^\{([^}]+)\}/g, '<span class="math-op-box"><span class="math-limit-top">$2</span><span class="math-op-sym">&prod;</span><span class="math-limit-bot">$1</span></span>')
            .replace(/\\prod/g, '<span class="math-op-sym">&prod;</span>')
            .replace(/\\log_([0-9a-zA-Z]+)/g, 'log<sub>$1</sub>')
            .replace(/\\log_\{([^}]+)\}/g, 'log<sub>$1</sub>')
            .replace(/\\ln/g, 'ln')
            .replace(/\\exp/g, 'exp')
            .replace(/\\arg\\max_\{([^}]+)\}/g, 'arg max<sub>$1</sub>')
            .replace(/\\arg\\min_\{([^}]+)\}/g, 'arg min<sub>$1</sub>')
            .replace(/\\theta/g, '&theta;')
            .replace(/\\sigma/g, '&sigma;')
            .replace(/\\mu/g, '&mu;')
            .replace(/\\eta/g, '&eta;')
            .replace(/\\alpha/g, '&alpha;')
            .replace(/\\beta/g, '&beta;')
            .replace(/\\gamma/g, '&gamma;')
            .replace(/\\Delta/g, '&Delta;')
            .replace(/\\nabla/g, '&nabla;')
            .replace(/\\lambda/g, '&lambda;')
            .replace(/\\epsilon/g, '&epsilon;')
            .replace(/\\omega/g, '&omega;')
            .replace(/\\partial/g, '&part;')
            .replace(/\\infty/g, '&infin;')
            .replace(/\\sqrt\{([^}]+)\}/g, '<span class="math-sqrt">&radic;<span class="math-sqrt-content">$1</span></span>')
            .replace(/\\left\(|\\right\)/g, '')
            .replace(/\\left\||\\right\|/g, '|')
            .replace(/\\left\[|\\right\]/g, '')
            .replace(/\\mid/g, '|')
            .replace(/\\quad|\\qquad/g, ' &nbsp;&nbsp; ')
            .replace(/\\text\{([^}]+)\}/g, '<span style="font-family:var(--font-sans);font-weight:600;color:var(--primary);">$1</span>')
            .replace(/\\in/g, '&isin;')
            .replace(/\\mathbb\{R\}/g, '&#8477;')
            .replace(/\\approx/g, '&approx;')
            .replace(/\\ge/g, '&ge;')
            .replace(/\\le/g, '&le;')
            .replace(/\\rightarrow|\\to/g, '&rarr;')
            .replace(/\\Rightarrow/g, '&rArr;')
            .replace(/\\cdot/g, '&middot;')
            .replace(/\\times/g, '&times;')
            .replace(/\\dots|\\ldots/g, '...')
            .replace(/\\mathbf\{([^}]+)\}/g, '<b>$1</b>')
            .replace(/\\mathcal\{([^}]+)\}/g, '<span style="font-family:serif;font-style:italic;">$1</span>')
            .replace(/\^([0-9A-Za-z]+)/g, '<sup>$1</sup>')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/_([0-9A-Za-z]+)/g, '<sub>$1</sub>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');
    }
"@

if ($js.Contains($oldCleanLatex)) {
    $js = $js.Replace($oldCleanLatex, $newCleanLatex)
    Write-Host "Upgraded cleanLatexString with textbook math layout symbols."
} else {
    $js = [regex]::Replace($js, 'function cleanLatexString\(str\)\s*\{[\s\S]*?replace\(/_\\\{\[\^\}\]\+\\\}\/g,\s*''<sub>\$1<\/sub>''\);\s*\}', $newCleanLatex)
    Write-Host "Upgraded cleanLatexString via regex."
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pathJs, $js, $utf8NoBom)
Write-Host "Completed app.js reset & math engine upgrades clean."
