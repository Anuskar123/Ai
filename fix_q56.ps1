$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Fix q56 stray backtick
$js = $js.Replace("classify strictly as **Narrow/Domain-Specific AI``.``", "classify strictly as **Narrow/Domain-Specific AI**.`")
$js = $js -replace 'AI`\.`', 'AI**.`'

# Check if there are any other instances of `.` or .` or double backticks
$lines = $js -split '`r?`n'
Write-Host "Scanning upgraded app.js for any remaining syntax anomalies..."
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '\.`' -or $lines[$i] -match '`\.' -or $lines[$i] -match '``') {
        # Check if it is valid or suspicious
        if ($lines[$i] -notmatch 'explanation:\s*`' -and $lines[$i] -notmatch 'text:\s*`') {
            Write-Host "Line $($i+1): $($lines[$i])"
        }
    }
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", $js, $utf8NoBom)
Write-Host "Fixed q56 syntax error and saved app.js ($($js.Length) bytes)."
