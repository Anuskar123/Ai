$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
Write-Host "app.js exact length: $($js.Length)"
$matches = [regex]::Matches($js, "CSY3081: AI CONCEPTS AND APPLICATIONS")
Write-Host "Occurrences of header in app.js: $($matches.Count)"
$qMatches = [regex]::Matches($js, "const QUESTION_BANK =")
Write-Host "Occurrences of QUESTION_BANK in app.js: $($qMatches.Count)"
