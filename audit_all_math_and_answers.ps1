$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Let's inspect QUESTION_BANK fill in the blanks
Write-Host "=== FILL IN THE BLANKS IN QUESTION_BANK ==="
$fbMatches = [regex]::Matches($c, 'id:\s*[''"](q\d+)[''"][\s\S]*?text:\s*[''"]([\s\S]*?)[''"][\s\S]*?correctAnswer:\s*[''"]([\s\S]*?)[''"][\s\S]*?acceptableAnswers:\s*\[([\s\S]*?)\][\s\S]*?explanation:\s*[''"]([\s\S]*?)[''"]\s*\}')
foreach ($m in $fbMatches) {
    Write-Host "[$($m.Groups[1].Value)] Ans: $($m.Groups[3].Value) | Acceptable: $($m.Groups[4].Value)"
    Write-Host "Text: $($m.Groups[2].Value)"
    Write-Host "Exp: $($m.Groups[5].Value.Substring(0, [Math]::Min($m.Groups[5].Value.Length, 100)))`n"
}

# Let's check test1Questions specifically where math formulas or tricky questions might exist
Write-Host "=== TEST 1 QUESTIONS WITH MATH / NUMERICAL FORMULAS ==="
$lines = $c -split "`r?`n"
$inT1 = $false
$curQ = ""
$curCI = ""
$curExp = ""
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]
    if ($l -match 'window\.test1Questions\s*=') { $inT1 = $true }
    if ($inT1 -and $l -match 'window\.renderTest1Questions') { $inT1 = $false }
    if ($inT1) {
        if ($l -match 'question:\s*(?:`|''|")([\s\S]*?)(?:`|''|")?,?$') { $curQ = $matches[1] }
        if ($l -match 'correctIndex:\s*(\d+)') {
            $curCI = $matches[1]
            Write-Host "CI=$curCI | Q: $($curQ.Substring(0, [Math]::Min($curQ.Length, 85)))"
        }
    }
}
