$code = Get-Content -Path "app.js" -Raw
$html = Get-Content -Path "index.html" -Raw

$pattern = 'getElementById\([\'"]([^\'"]+)[\'"]\)'
$matches = [System.Text.RegularExpressions.Regex]::Matches($code, $pattern)

Write-Host "--- Cross Checking getElementById IDs ---"
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    if ($html -notmatch "id=`"$id`"" -and $html -notmatch "id='$id'") {
        if ($id -notlike "card-q*" -and $id -notlike "input-q*" -and $id -notlike "sel-q*") {
            Write-Host "[CHECK ID] : $id"
        }
    }
}
