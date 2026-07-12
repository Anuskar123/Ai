$code = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$lines = $code -split "`r?`n"
$balance = 0
for ($i = 0; $i -lt $lines.Count; $i++) {
    $l = $lines[$i]
    # Count { vs } outside strings (rough approximation or exact character scan)
    foreach ($c in $l.ToCharArray()) {
        if ($c -eq '{') { $balance++ }
        elseif ($c -eq '}') { $balance-- }
    }
    if ($balance -lt 0) {
        Write-Host "Balance dipped to $balance at line $($i+1): $($l.Substring(0, [Math]::Min($l.Length, 80)))"
    }
}
Write-Host "Final balance: $balance"
