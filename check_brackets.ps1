$code = Get-Content -Path "app.js" -Raw
$bOpen = ($code.ToCharArray() | Where-Object { $_ -eq '{' }).Count
$bClose = ($code.ToCharArray() | Where-Object { $_ -eq '}' }).Count
$pOpen = ($code.ToCharArray() | Where-Object { $_ -eq '(' }).Count
$pClose = ($code.ToCharArray() | Where-Object { $_ -eq ')' }).Count
$kOpen = ($code.ToCharArray() | Where-Object { $_ -eq '[' }).Count
$kClose = ($code.ToCharArray() | Where-Object { $_ -eq ']' }).Count

Write-Host "Braces { vs } : $bOpen vs $bClose"
Write-Host "Parens ( vs ) : $pOpen vs $pClose"
Write-Host "Brackets [ vs ] : $kOpen vs $kClose"
