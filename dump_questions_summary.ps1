$c = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Let's find title: and correctIndex: lines
$lines = $c -split "`r?`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'title:\s*(?:''|")([^''"]+)') {
        $title = $matches[1]
        $ci = "unknown"
        # Look ahead up to 30 lines for correctIndex
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 35); $j++) {
            if ($lines[$j] -match 'correctIndex:\s*(\d+)') {
                $ci = $matches[1]
                break
            }
            if ($lines[$j] -match 'correctAnswer:\s*(?:''|")([^''"]+)') {
                $ci = "Fill: " + $matches[1]
                break
            }
        }
        Write-Host "Q: $title | CI: $ci"
    }
}
