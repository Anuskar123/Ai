$js = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\app.js", [System.Text.Encoding]::UTF8)
$start = $js.IndexOf("All existing real-world AI systems today")
if ($start -ge 0) {
    $sub = $js.Substring($start, 300)
    Write-Host "--- q56 end in app.js ---"
    Write-Host $sub
} else {
    Write-Host "Not found!"
}
