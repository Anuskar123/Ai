$lines = [System.IO.File]::ReadAllLines("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)
Write-Host "Total lines: $($lines.Length)"
$start = [Math]::Max(0, 5690)
$end = [Math]::Min($lines.Length - 1, 5705)
for ($i = $start; $i -le $end; $i++) {
    Write-Host "Line $($i + 1): $($lines[$i])"
}
