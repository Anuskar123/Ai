$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$lines = $c -split "`r?`n"
for ($i = 234; $i -lt [Math]::Min($lines.Count, 260); $i++) {
    Write-Host "$($i+1): $($lines[$i].Substring(0, [Math]::Min($lines[$i].Length, 100)))"
}
Write-Host "--- detailed notes header ---"
for ($i = 487; $i -lt [Math]::Min($lines.Count, 515); $i++) {
    Write-Host "$($i+1): $($lines[$i].Substring(0, [Math]::Min($lines[$i].Length, 100)))"
}
