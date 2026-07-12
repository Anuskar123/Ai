$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$lines = $js -split '`r?`n'
$bt = [char]96
Write-Host "Checking all $($lines.Length) lines of app.js for any stray dot-backtick or double-backtick..."
$found = 0
for ($i = 0; $i -lt $lines.Length; $i++) {
    $l = $lines[$i]
    if ($l.IndexOf("." + $bt + ",") -ge 0 -or $l.IndexOf("." + $bt + " " + $bt) -ge 0 -or $l.IndexOf($bt + "." + $bt) -ge 0 -or $l.IndexOf("````") -ge 0) {
        Write-Host "Anomaly on Line $($i+1): $l"
        $found++
    }
}
Write-Host "Total anomalies found: $found"
