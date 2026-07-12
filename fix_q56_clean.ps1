$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

$target = "All existing real-world AI systems today"
$idx = $js.IndexOf($target)
if ($idx -ge 0) {
    $endIdx = $js.IndexOf("    },", $idx)
    $badPart = $js.Substring($idx, $endIdx - $idx)
    Write-Host "Old part: $badPart"
    
    # Use exact char 96 (backtick) via [char]96 to avoid any PowerShell string escaping issues
    $bt = [char]96
    $goodPart = "All existing real-world AI systems today-including GPT-4 and Claude 3.5-classify strictly as **Narrow/Domain-Specific AI**." + $bt
    $js = $js.Substring(0, $idx) + $goodPart + [Environment]::NewLine + $js.Substring($endIdx)
    Write-Host "Replaced q56 explanation ending cleanly."
} else {
    Write-Host "Could not find target string."
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", $js, $utf8NoBom)
Write-Host "Saved app.js cleanly."
