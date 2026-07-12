$app = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$test2 = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test2_logic.js", [System.Text.Encoding]::UTF8)

if ($app -notlike "*TEST 2 ASSESSMENT ENGINE*") {
    $combined = $app + "`r`n`r`n" + $test2
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", $combined, $utf8NoBom)
    Write-Host "Successfully appended test2_logic.js to app.js! New length: $($combined.Length)"
} else {
    Write-Host "test2_logic.js is already inside app.js!"
}
