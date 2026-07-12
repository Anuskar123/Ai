$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Let's extract test1Questions and test2Questions sections
$t1Idx = $c.IndexOf('window.test1Questions = [')
$t2Idx = $c.IndexOf('window.test2Questions = [')

if ($t1Idx -ge 0 -and $t2Idx -gt $t1Idx) {
    $t1Text = $c.Substring($t1Idx, $t2Idx - $t1Idx)
    # Parse out each question in test1
    $qMatches = [regex]::Matches($t1Text, 'id:\s*(\d+|''[^'']+''|"[^"]+").*?question:\s*(?:`|''|")([\s\S]*?)(?:`|''|").*?options:\s*\[([\s\S]*?)\]\s*,\s*correctIndex:\s*(\d+).*?explanation:\s*(?:`|''|")([\s\S]*?)(?:`|''|")\s*\}')
    Write-Host "Total test1 questions extracted: $($qMatches.Count)"
    
    foreach ($m in $qMatches) {
        $id = $m.Groups[1].Value
        $q = $m.Groups[2].Value -replace '[\r\n]+', ' '
        $opts = $m.Groups[3].Value
        $ci = $m.Groups[4].Value
        $exp = $m.Groups[5].Value -replace '[\r\n]+', ' '
        Write-Host "--- T1 Q$id (CI: $ci) ---"
        Write-Host "Q: $($q.Substring(0, [Math]::Min($q.Length, 100)))"
        Write-Host "Opts: $($opts.Substring(0, [Math]::Min($opts.Length, 120)))"
        Write-Host "Exp: $($exp.Substring(0, [Math]::Min($exp.Length, 120)))"
    }
}
