$lines = [System.IO.File]::ReadAllLines("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)
for ($i = 5690; $i -le 5700; $i++) {
    Write-Host "Line $($i+1): $($lines[$i])"
}
