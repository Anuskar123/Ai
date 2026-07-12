$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$start = $js.IndexOf("id: 'q56'")
if ($start -ge 0) {
    $sub = $js.Substring($start, 1000)
    Write-Host "--- q56 in app.js ---"
    Write-Host $sub
} else {
    Write-Host "q56 not found!"
}
