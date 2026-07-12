$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$lines = $js -split '`r?`n'
Write-Host "Scanning app.js lines ($($lines.Length)) for syntax issues like stray backticks or dots before backticks..."
for ($i = 0; $i -lt $lines.Length; $i++) {
    # Check if there is `.`` right before `,` or at end of string
    if ($lines[$i] -match '\.`\s*,' -or $lines[$i] -match '\.`\s*$`' -or $lines[$i] -match '\.`\.' -or $lines[$i] -match 'AI`\.`') {
        Write-Host "Suspicious backtick on Line $($i + 1): $($lines[$i])"
    }
}
