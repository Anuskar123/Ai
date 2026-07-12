$pathJs = "c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js"
$js = [System.IO.File]::ReadAllText($pathJs, [System.Text.Encoding]::UTF8)
$js = $js.Replace("icon.innerText = '☀️';", "icon.innerText = '\u2600\uFE0F';")
$js = $js.Replace("icon.innerText = '🌙';", "icon.innerText = '\uD83C\uDF19';")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pathJs, $js, $utf8NoBom)
Write-Host "Updated emoji literals to unicode escapes in app.js."
