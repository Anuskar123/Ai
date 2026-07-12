$lines = [System.IO.File]::ReadAllLines("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$kept = $lines[0..1462] + @("", '<script src="app.js"></script>', "</body>", "</html>")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", $kept, $utf8NoBom)
Write-Host "Cleaned csy3081_external.html successfully. New line count: $($kept.Count)"
