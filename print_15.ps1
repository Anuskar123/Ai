$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$lines = $c -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '\u00E2|\u00C3|\u00EF|\?\?') {
        Write-Host "Line $($i+1): $($lines[$i].Trim())"
    }
}
