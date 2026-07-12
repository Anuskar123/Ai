$app = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$ext = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\csy3081_external.html", [System.Text.Encoding]::UTF8)
$test2 = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\test2_logic.js", [System.Text.Encoding]::UTF8)

Write-Host "app length: $($app.Length)"
Write-Host "test2 length: $($test2.Length)"
Write-Host "Does app.js contain test2_logic text (e.g. cryptoransomware)? $($app -match 'cryptoransomware')"
Write-Host "Does test2_logic.js contain cryptoransomware? $($test2 -match 'cryptoransomware')"
Write-Host "Does csy3081_external.html contain script src test2_logic.js? $($ext -match 'test2_logic')"
