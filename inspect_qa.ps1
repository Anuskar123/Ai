$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Let's count how many questions in test1 and test2 and sample a few explanations and correctIndex
$matches = [regex]::Matches($c, 'id:\s*(?:''|")[^''"]*(?:''|")[^}]*?correctIndex:\s*(\d+)[^}]*?explanation:\s*(?:`|''|")([\s\S]*?)(?:`|''|")\s*\}')
Write-Host "Found $($matches.Count) questions with correctIndex & explanation in app.js."

for ($i = 0; $i -lt [Math]::Min($matches.Count, 5); $i++) {
    $m = $matches[$i]
    Write-Host "--- Question $($i+1) (correctIndex: $($m.Groups[1].Value)) ---"
    Write-Host $($m.Groups[2].Value.Substring(0, [Math]::Min($m.Groups[2].Value.Length, 150)))
}
