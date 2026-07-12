$files = @('csy3081_external.html', 'app.js', 'style.css', 'test2_logic.js')

foreach ($f in $files) {
    $path = Join-Path "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal" $f
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

    # Check remaining matches for timestamps or non-ASCII
    $lines = $content -split "`r?`n"
    $remTime = 0
    $remMoji = 0
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i] -match '\b\d{1,2}:\d{2}(?::\d{2})?\b|\[\d{1,2}:\d{2}') {
            if ($lines[$i] -notmatch 'box-shadow|z-index|stroke|min-height|line-height|30:00|00:00|timer-clock') {
                Write-Host "Remaining time match in $f ($($i+1)): $($lines[$i].Trim())"
                $remTime++
            }
        }
        if ($lines[$i] -match '[\u0080-\uFFFF]') {
            Write-Host "Remaining non-ASCII match in $f ($($i+1)): $($lines[$i].Trim())"
            $remMoji++
        }
    }
    Write-Host "$f summary -> Remaining Times: $remTime | Remaining Non-ASCII: $remMoji"
}
