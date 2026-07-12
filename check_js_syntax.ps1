# Check for syntax/brace balance and test evaluation using JScript
$code = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)

# Simple brace counting
$openB = ($code.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$closeB = ($code.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$openP = ($code.ToCharArray() | Where-Object { $_ -eq '(' }).Count
$closeP = ($code.ToCharArray() | Where-Object { $_ -eq ')' }).Count

Write-Host "app.js Brace count: open { = $openB, close } = $closeB"
Write-Host "app.js Paren count: open ( = $openP, close ) = $closeP"

# Let's check lines near where we hooked `setTimeout` to see if braces got broken
$lines = $code -split "`r?`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(\s*window\.renderAllMath') {
        Write-Host "Line $($i+1): $($lines[$i].Substring(0, [Math]::Min($lines[$i].Length, 120)))"
    }
}
