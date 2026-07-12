$files = @('csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')

foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
    if (-not (Test-Path $path)) { continue }
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

    # 1. Clean brand & header text / mojibake symbols
    $content = [regex]::Replace($content, 'University of Northampton\s+[^\w\s\d\|]+\s+20-Credit Module Prep', 'University of Northampton | 20-Credit Module Prep')
    $content = [regex]::Replace($content, 'Lab 0([1-4])\s+[^\w\s\d\|]+\s+Course Segment.*?<\/span>', 'Lab 0$1 | Interactive Simulator</span>')
    $content = [regex]::Replace($content, 'Timed Assessment Active \(\s*30 Questions\s+[^\w\s\d\|]+\s+50 Total Points\s*\)', 'Timed Assessment Active (30 Questions | 50 Total Points)')
    $content = [regex]::Replace($content, '30 Questions\s+[^\w\s\d\|]+\s+50 Total Points', '30 Questions | 50 Total Points')
    $content = [regex]::Replace($content, 'JS Warning \(Line " \+ line \+ "\): " \+ msg \+ "\s+[^\w\s\d\|]+\s+Please press Ctrl\+F5', 'JS Warning (Line " + line + "): " + msg + " | Please press Ctrl+F5')

    # 2. Clean card-time elements in external html
    $content = [regex]::Replace($content, '<div class="card-time">00:00 - 27:12<\/div>', '<div class="card-time">Module 1</div>')
    $content = [regex]::Replace($content, '<div class="card-time">27:12 - 1:04:49<\/div>', '<div class="card-time">Module 2</div>')
    $content = [regex]::Replace($content, '<div class="card-time">1:04:49 - 1:35:36<\/div>', '<div class="card-time">Module 3</div>')
    $content = [regex]::Replace($content, '<div class="card-time">1:35:36 - 2:07:31<\/div>', '<div class="card-time">Module 4</div>')
    $content = [regex]::Replace($content, '<div class="card-time">2:07:31 - 2:42:36<\/div>', '<div class="card-time">Module 5</div>')
    $content = [regex]::Replace($content, '<div class="card-time">2:42:36 - 3:33:08<\/div>', '<div class="card-time">Module 6</div>')
    
    # 3. Clean study note badges
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[00:00 - 15:45\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 1 | AI vs. ML vs. DL</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[15:45 - 48:20\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 2 | Supervised Regression</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[1:18:20 - 1:55:00\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 3 | Classification & Softmax</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[1:55:00 - 2:38:00\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 4 | Decision Trees</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:38:00 - 2:42:45\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 4 | Random Forest</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:42:45 - 2:54:30\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 5 | K-Means & PCA</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:54:30 - 2:56:40\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 5 | Apriori Mining</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:14:37 - 2:38:00\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 4 | K-Nearest Neighbors</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:38:00\+\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 4 | Support Vector Machines</span>')
    $content = [regex]::Replace($content, '<span class="badge badge-primary mb-2">Lecture Segment `?\[2:56:40 - 3:33:08\]`?<\/span>', '<span class="badge badge-primary mb-2">Module 6 | Reinforcement Learning</span>')
    $content = [regex]::Replace($content, '<span class="doc-tag">Video Segment `?\[3:33:08\]`?<\/span>', '<span class="doc-tag">Ethics & Safety</span>')

    # 4. Clean specific compound timestamp references
    $content = [regex]::Replace($content, '\(`04_training_linear_models` & `\[35:10\]`\)', '(`04_training_linear_models`)')
    $content = [regex]::Replace($content, '\(`tutorial unsupervised learning\.docx` & `\[2:54:30\]`\)', '(`tutorial unsupervised learning.docx`)')
    $content = [regex]::Replace($content, '\(`logistic softmax\.docx` & `\[1:44:10\]`\)', '(`logistic softmax.docx`)')
    $content = [regex]::Replace($content, 'from `00:00` to `3:33:08`', 'across all modules')
    $content = [regex]::Replace($content, 'from 00:00 to 3:33:08', 'across all modules')

    # 5. Clean general parenthesized timestamps or time ranges e.g. ([20:24]) or (`[1:35:36]`) or (`00:00 - 3:33:08`) or (`[20:24] - [3:33:08]`)
    $content = [regex]::Replace($content, '\s*\(`?\[?\d{1,2}:\d{2}(?::\d{2})?(?:\s*[-–—]\s*`?\[?\d{1,2}:\d{2}(?::\d{2})?\]?`?)?\+?\]?`?\)', '')
    $content = [regex]::Replace($content, '\s*\(`?\[?\d{1,2}:\d{2}(?::\d{2})?\s*[-–—]\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?`?\)', '')

    # 6. Check if any remaining timestamps like [20:24] or `[20:24]` without parens exist
    $content = [regex]::Replace($content, '`\[\d{1,2}:\d{2}(?::\d{2})?(?:\s*[-–—]\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?)?\+?\]`', '')
    $content = [regex]::Replace($content, '\[\d{1,2}:\d{2}(?::\d{2})?(?:\s*[-–—]\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?)?\+?\]', '')
    $content = [regex]::Replace($content, '`00:00 - 3:33:08`', '')
    $content = [regex]::Replace($content, '00:00 - 3:33:08', '')

    # 7. Clean double parens or bold wrapped around removed times like (**KNN**) -> **KNN**
    $content = [regex]::Replace($content, '\(\s*\*\*([^*]+)\*\*\s*\)', '**$1**')

    # 8. Clean mojibake ?? or  inside test2_logic.js / app.js explanation prefixes and buttons
    $content = [regex]::Replace($content, '\?\?\s*Official CSY3081 Detailed Solution & Proof', 'Official CSY3081 Detailed Solution & Proof')
    $content = [regex]::Replace($content, '\?\?\s*Official Explanation', 'Official Explanation')
    $content = [regex]::Replace($content, '\?\?\s*Real-World Example', 'Real-World Example')
    $content = [regex]::Replace($content, '\?\?\s*Official Course Taxonomy', 'Official Course Taxonomy')
    $content = [regex]::Replace($content, '\?\?\s*Official Metric Derivations', 'Official Metric Derivations')
    $content = [regex]::Replace($content, '\?\?\s*Official Kernel Trick Proof', 'Official Kernel Trick Proof')
    $content = [regex]::Replace($content, '\?\?\s*Official Preprocessing Checklist', 'Official Preprocessing Checklist')
    $content = [regex]::Replace($content, '\?\?\s*Official Exam Guarantee', 'Official Exam Guarantee')
    $content = [regex]::Replace($content, '\?\?\s*Revealed all 36 Test 2', 'Revealed all 36 Test 2')
    $content = [regex]::Replace($content, 'q\.type === \x27matching\x27 \? \x27\?\?\s*\x27', 'q.type === ''matching'' ? ''''')
    $content = [regex]::Replace($content, '<span>[^\w\s<>\/]+ Correct<\/span>', '<span>[Correct]</span>')
    $content = [regex]::Replace($content, '<span>[^\w\s<>\/]+ Incorrect<\/span>', '<span>[Incorrect]</span>')
    $content = [regex]::Replace($content, 'showToast\(isCorrect \? `[^\w\s`\$]+ Spot on!', 'showToast(isCorrect ? `Spot on!')
    $content = [regex]::Replace($content, 'showToast\("[^\w\s"]+ Test 2 assessment score reset', 'showToast("Test 2 assessment score reset')
    $content = [regex]::Replace($content, 'APPLIED AI & MACHINE LEARNING PLATFORM\s+-\s+STYLESHEET', 'APPLIED AI & MACHINE LEARNING PLATFORM - STYLESHEET')

    # Clean stray unicode symbol sequences safely
    $content = [regex]::Replace($content, '\u00E2\u0080\u00A2|\u2022', '|')
    $content = [regex]::Replace($content, '\u00E2\u0080\u0093|\u00E2\u0080\u0094|\u2013|\u2014', '-')
    $content = [regex]::Replace($content, '\u00E2\u0080\u0099|\u2019', "'")
    $content = [regex]::Replace($content, '\u00E2\u0080\u009C|\u00E2\u0080\u009D|\u201C|\u201D', '"')

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
    Write-Host "Successfully cleaned and updated $f ($($content.Length) bytes)."
}
