$html = [System.IO.File]::ReadAllText("c:\Users\Anuskar\Downloads\ai-practice\ml-exam-portal\index.html", [System.Text.Encoding]::UTF8)
$scripts = [regex]::Matches($html, '(?s)<script>.*?</script>')
Write-Host "Number of <script> blocks: $($scripts.Count)"
for ($i = 0; $i -lt $scripts.Count; $i++) {
    $val = $scripts[$i].Value
    $sub = $val.Substring(0, [Math]::Min(120, $val.Length)) -replace '`r`n', ' '
    Write-Host "Script $i (Length $($val.Length)): $sub..."
}
