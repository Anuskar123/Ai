$app = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$lines = $app -split "`r?`n"
$count = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'â|•|&bull;|\b\d{2}:\d{2}\b|\[\d{1,2}:\d{2}|card-time|time-badge|(`\b\d+ Qs`)|(`\b\d+ Demos`)|\(`00:00') {
        $count++
        if ($count -le 30) {
            Write-Host "app.js Line $($i+1): $($lines[$i].Trim())"
        }
    }
}
Write-Host "Total matches in app.js : $count"
