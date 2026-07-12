$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$start = $js.IndexOf("function switchTabSection")
$sub = $js.Substring($start, 2500)
Write-Host "--- switchTabSection function implementation ---"
Write-Host $sub
