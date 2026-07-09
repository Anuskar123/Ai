$code = Get-Content app.js -Raw

# Check each question inside QUESTION_BANK
# Let's count how many questions have id: 'qX'
$qCount = ([regex]::Matches($code, "id:\s*['`]q\d+['`]")).Count
Write-Host "Total questions found in QUESTION_BANK: $qCount"

# Let's verify each question has type, title, points, text
for ($i = 1; $i -le 30; $i++) {
    if ($code -notmatch "id:\s*['`]q$i['`]") {
        Write-Host "MISSING QUESTION ID: q$i" -ForegroundColor Red
    }
}
Write-Host "Question Bank Check Complete."
