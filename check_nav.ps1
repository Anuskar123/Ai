$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$start = $js.IndexOf("function initNavigation()")
$sub = $js.Substring($start, 1200)
Write-Host "--- initNavigation ---"
Write-Host $sub
