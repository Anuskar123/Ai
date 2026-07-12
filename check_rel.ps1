$app = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$t2 = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test2_logic.js", [System.Text.Encoding]::UTF8)

# Check if $t2 is exact substring of $app
if ($app.Contains($t2)) {
    Write-Host "test2_logic.js is an EXACT substring inside app.js!"
} else {
    Write-Host "test2_logic.js is NOT an exact substring, but shares text."
}
