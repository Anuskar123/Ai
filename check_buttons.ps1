$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)
$matches = [regex]::Matches($html, '<button[^>]*nav-tab[^>]*>')
foreach ($m in $matches) {
    Write-Host $m.Value
}
